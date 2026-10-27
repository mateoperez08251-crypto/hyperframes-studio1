"""Measure a bounded range, with the same token and unchanged master bytes."""
import argparse
import hashlib
import json
import pathlib
import time
import urllib.request

parser = argparse.ArgumentParser()
parser.add_argument('--url')
parser.add_argument('--report', required=True)
args = parser.parse_args()
config = json.loads(pathlib.Path(__file__).with_name('connection.local.json').read_text())
base = args.url or config['url']
count = 1024 * 1024
request = urllib.request.Request(base + '/v1/files/master', headers={
    'Authorization': 'Bearer ' + config['token'], 'Range': f'bytes=0-{count - 1}'})
start = time.perf_counter()
with urllib.request.urlopen(request, timeout=30) as response:
    assert response.status == 206
    data = response.read()
elapsed = time.perf_counter() - start
assert len(data) == count
prefix = pathlib.Path(__file__).resolve().parents[2] / 'irena-cine-20s/irena-cine-20s.mp4.partial'
with prefix.open('rb') as local:
    assert local.read(count) == data
report = {'url': base, 'bytes': len(data), 'seconds': round(elapsed, 3),
          'MBps': round(len(data) / elapsed / 1e6, 3),
          'rangeVerified': True, 'sha256': hashlib.sha256(data).hexdigest()}
pathlib.Path(args.report).write_text(json.dumps(report, indent=2), encoding='utf8')
print(json.dumps(report, indent=2))
