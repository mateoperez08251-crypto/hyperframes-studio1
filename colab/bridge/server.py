"""Read-only, token-authenticated transfer bridge. Exposes only configured files."""
import argparse
import hashlib
import hmac
import json
import pathlib
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


def byte_range(value, size):
    if not value:
        return 0, size - 1, False
    match = re.fullmatch(r"bytes=(\d*)-(\d*)", value)
    if not match or not any(match.groups()):
        raise ValueError("Unsupported range")
    first, last = match.groups()
    if not first:
        count = int(last)
        if count <= 0:
            raise ValueError("Invalid suffix")
        start, end = max(0, size - count), size - 1
    else:
        start = int(first)
        end = min(int(last), size - 1) if last else size - 1
    if start >= size or start > end:
        raise ValueError("Unsatisfiable range")
    return start, end, True


def make_handler(config):
    token = config["token"]
    files = {}
    for file_id, raw in config["files"].items():
        path = pathlib.Path(raw).resolve(strict=True)
        with path.open("rb") as stream:
            digest = hashlib.file_digest(stream, "sha256").hexdigest()
        files[file_id] = {"path": path, "name": path.name,
                          "size": path.stat().st_size, "sha256": digest}

    class Handler(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"
        server_version = "ColabBridge/1"

        def do_HEAD(self):
            self.respond(head=True)

        def do_GET(self):
            self.respond(head=False)

        def json_response(self, status, payload, head):
            body = json.dumps(payload).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "private, no-store")
            self.end_headers()
            if not head:
                self.wfile.write(body)

        def respond(self, head):
            supplied = self.headers.get("Authorization", "")
            if not hmac.compare_digest(supplied.encode("utf-8"), ("Bearer " + token).encode("utf-8")):
                return self.json_response(401, {"error": "Unauthorized"}, head)
            route = urlsplit(self.path).path
            if route == "/v1/health":
                return self.json_response(200, {"ok": True, "version": 1}, head)
            if route == "/v1/files":
                public = [{"id": key, **{k: v for k, v in file.items() if k != "path"}}
                          for key, file in files.items()]
                return self.json_response(200, {"files": public}, head)
            file_id = route.removeprefix("/v1/files/")
            if not route.startswith("/v1/files/") or file_id not in files:
                return self.json_response(404, {"error": "Not found"}, head)
            file = files[file_id]
            try:
                start, end, partial = byte_range(self.headers.get("Range"), file["size"])
            except ValueError:
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{file['size']}")
                self.send_header("Content-Length", "0")
                self.end_headers()
                return
            self.send_response(206 if partial else 200)
            self.send_header("Content-Type", "application/octet-stream")
            self.send_header("Content-Length", str(end - start + 1))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("ETag", '"' + file["sha256"] + '"')
            self.send_header("Cache-Control", "private, no-store")
            self.send_header("Content-Disposition", f'attachment; filename="{file["name"]}"')
            if partial:
                self.send_header("Content-Range", f"bytes {start}-{end}/{file['size']}")
            self.end_headers()
            if head:
                return
            try:
                with file["path"].open("rb") as stream:
                    stream.seek(start)
                    remaining = end - start + 1
                    while remaining:
                        chunk = stream.read(min(1024 * 1024, remaining))
                        if not chunk:
                            break
                        self.wfile.write(chunk)
                        remaining -= len(chunk)
            except (BrokenPipeError, ConnectionResetError):
                pass

    return Handler


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    settings = json.loads(pathlib.Path(args.config).read_text())
    ThreadingHTTPServer(("127.0.0.1", args.port), make_handler(settings)).serve_forever()
