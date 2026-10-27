"""Run on Colab over SSH; test a second transport without replacing SSH."""
import pathlib
import subprocess
import time
import re
import json

root = pathlib.Path('/content/hyperframes-bridge')
log = root / 'http2.log'
with log.open('wb') as output:
    process = subprocess.Popen(['cloudflared', 'tunnel', '--no-autoupdate', '--protocol',
                                'http2', '--url', 'http://127.0.0.1:8765'],
                               stdout=output, stderr=output, start_new_session=True)
for attempt in range(160):
    found = re.search(r'https://[a-z0-9-]+\.trycloudflare\.com', log.read_text(errors='replace'))
    if found:
        state = {'url': found.group(0), 'pid': process.pid, 'protocol': 'http2'}
        (root / 'http2.json').write_text(json.dumps(state))
        print(json.dumps(state))
        break
    if process.poll() is not None:
        raise RuntimeError('HTTP2 tunnel exited; inspect http2.log')
    time.sleep(.25)
else:
    raise RuntimeError('Tunnel URL timeout; process/log retained')
