"""Control the authenticated bridge and resume exact, checksum-verified downloads."""
import argparse
import hashlib
import json
import pathlib
import time
import urllib.request


def run(args):
    config = json.loads(pathlib.Path(args.config).read_text(encoding="utf-8"))
    base = config["url"].rstrip("/")
    if not base.startswith("https://"):
        raise ValueError("Remote bridge must use HTTPS")
    headers = {"Authorization": "Bearer " + config["token"]}

    def request(path, extra=None):
        req = urllib.request.Request(base + path, headers={**headers, **(extra or {})})
        return urllib.request.urlopen(req, timeout=45)

    if args.command == "status":
        with request("/v1/health") as response:
            print(response.read().decode())
        return
    with request("/v1/files") as response:
        listing = json.load(response)["files"]
    if args.command == "list":
        print(json.dumps(listing, indent=2))
        return
    file = next(item for item in listing if item["id"] == args.file)
    target = pathlib.Path(args.output).resolve()
    target.parent.mkdir(parents=True, exist_ok=True)
    partial = target.with_name(target.name + ".partial")
    if target.exists():
        raise FileExistsError("Output already exists; choose a new destination")
    offset = partial.stat().st_size if partial.exists() else 0
    if offset > file["size"]:
        raise ValueError("Partial file is larger than the remote file")
    started = time.perf_counter()
    last = started
    transferred = 0
    if offset < file["size"]:
        with request("/v1/files/" + args.file, {"Range": f"bytes={offset}-"}) as response:
            if response.status != 206 or not response.headers.get("Content-Range", "").startswith(f"bytes {offset}-"):
                raise ValueError("Server did not honor the requested resume range")
            with partial.open("ab") as out:
                while chunk := response.read(1024 * 1024):
                    out.write(chunk)
                    transferred += len(chunk)
                    now = time.perf_counter()
                    if now - last >= 3:
                        print(f"{offset + transferred}/{file['size']} bytes; {transferred / (now - started) / 1e6:.2f} MB/s", flush=True)
                        last = now
    elapsed = time.perf_counter() - started
    with partial.open("rb") as stream:
        digest = hashlib.file_digest(stream, "sha256").hexdigest()
    if partial.stat().st_size != file["size"] or digest != file["sha256"]:
        raise ValueError("Download incomplete or SHA256 mismatch; partial file retained")
    partial.rename(target)
    report = {"file": str(target), "bytes": file["size"], "resumedBytes": offset,
              "transferredBytes": transferred, "transferSeconds": round(elapsed, 3),
              "MBps": round(transferred / max(elapsed, .001) / 1e6, 3),
              "sha256": digest, "verified": True}
    if args.report:
        pathlib.Path(args.report).write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default=str(pathlib.Path(__file__).with_name("connection.local.json")))
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("status")
    commands.add_parser("list")
    get = commands.add_parser("get")
    get.add_argument("file")
    get.add_argument("output")
    get.add_argument("--report")
    run(parser.parse_args())
