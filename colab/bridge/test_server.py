import http.client
import pathlib
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from server import byte_range, make_handler


class BridgeTests(unittest.TestCase):
    def test_ranges(self):
        self.assertEqual(byte_range("bytes=3-5", 10), (3, 5, True))
        self.assertEqual(byte_range("bytes=-3", 10), (7, 9, True))
        self.assertEqual(byte_range("bytes=5-", 10), (5, 9, True))
        for value in ["bytes=10-", "bytes=8-4", "bytes=0-1,4-5", "bytes=-0"]:
            with self.assertRaises(ValueError):
                byte_range(value, 10)

    def test_http_access_and_resume(self):
        with tempfile.TemporaryDirectory() as folder:
            path = pathlib.Path(folder) / "video.mp4"
            path.write_bytes(b"0123456789")
            handler = make_handler({"token": "local-test-only", "files": {"master": str(path)}})
            server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            def request(route, method="GET", auth=True, extra=None):
                conn = http.client.HTTPConnection("127.0.0.1", server.server_port)
                headers = {"Authorization": "Bearer local-test-only"} if auth else {}
                conn.request(method, route, headers={**headers, **(extra or {})})
                response = conn.getresponse()
                result = response.status, dict(response.getheaders()), response.read()
                conn.close()
                return result
            try:
                self.assertEqual(request("/v1/files", auth=False)[0], 401)
                self.assertEqual(request("/v1/files", extra={"Authorization": "Bearer incorrecto-é"})[0], 401)
                self.assertEqual(request("/v1/files/../../server.py")[0], 404)
                self.assertEqual(request("/v1/files/master", extra={"Range": "bytes=3-5"})[2], b"345")
                self.assertEqual(request("/v1/files/master", extra={"Range": "bytes=3-"})[2], b"3456789")
                self.assertEqual(request("/v1/files/master", method="HEAD")[2], b"")
                self.assertEqual(request("/v1/files/master", extra={"Range": "bytes=10-"})[0], 416)
            finally:
                server.shutdown()
                server.server_close()
                thread.join()


if __name__ == "__main__":
    unittest.main()
