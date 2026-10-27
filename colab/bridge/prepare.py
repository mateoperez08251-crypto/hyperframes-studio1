"""Prepare a private SSH bootstrap without putting the access token in arguments."""
import argparse
import json
import pathlib
import secrets

root = pathlib.Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--exports', default=str(root / 'exports.json'))
args = parser.parse_args()
config_file = root / "connection.local.json"
config = json.loads(config_file.read_text()) if config_file.exists() else {"url": "", "token": secrets.token_urlsafe(32)}
config_file.write_text(json.dumps(config, indent=2), encoding="utf-8")
server_config = {"token": config["token"], "files": json.loads(pathlib.Path(args.exports).read_text(encoding='utf8'))}
source = (root / "server.py").read_text(encoding="utf-8")
bootstrap = "import pathlib,json,subprocess,time,re,urllib.request,os\n"
bootstrap += "root=pathlib.Path('/content/hyperframes-bridge'); root.mkdir(mode=0o700,exist_ok=True)\n"
bootstrap += "previous_source=(root/'server.py').read_text(encoding='utf8') if (root/'server.py').exists() else ''\n"
bootstrap += "previous_config=json.loads((root/'config.json').read_text()) if (root/'config.json').exists() else {}\n"
bootstrap += "(root/'server.py').write_text(" + repr(source) + ",encoding='utf8')\n"
bootstrap += "config=" + repr(server_config) + "\n"
bootstrap += "restart_required=previous_config!=config or previous_source!=" + repr(source) + "\n"
bootstrap += "(root/'config.json').write_text(json.dumps(config)); (root/'config.json').chmod(0o600)\n"
bootstrap += '''
state_file=root/'state.json'
state=json.loads(state_file.read_text()) if state_file.exists() else {}
if restart_required and state.get('serverPid'):
    try:
        previous_command=pathlib.Path('/proc/'+str(state['serverPid'])+'/cmdline').read_bytes()
        if str(root/'server.py').encode() in previous_command:
            os.kill(state['serverPid'],15)
            time.sleep(.5)
    except OSError:
        pass
server_ready=False
req=urllib.request.Request('http://127.0.0.1:8765/v1/health',headers={'Authorization':'Bearer '+config['token']})
try:
    with urllib.request.urlopen(req,timeout=2) as response:
        server_ready=response.status==200
except OSError:
    pass
if server_ready:
    server_pid=state.get('serverPid')
else:
    server_log=(root/'server.log').open('ab')
    server=subprocess.Popen(['python','-u',str(root/'server.py'),'--config',str(root/'config.json')],stdout=server_log,stderr=server_log,start_new_session=True)
    server_pid=server.pid
req=urllib.request.Request('http://127.0.0.1:8765/v1/health',headers={'Authorization':'Bearer '+config['token']})
for attempt in range(40):
    try:
        with urllib.request.urlopen(req,timeout=1) as response:
            assert response.status==200
        break
    except OSError:
        if not server_ready and server.poll() is not None: raise RuntimeError('Bridge failed; inspect private server log')
        time.sleep(.25)
else:
    raise RuntimeError('Bridge readiness timeout')
if state_file.exists():
    try:
        command=pathlib.Path('/proc/'+str(state['tunnelPid'])+'/cmdline').read_bytes()
        if b'http://127.0.0.1:8765' in command:
            state['serverPid']=server_pid
            state_file.write_text(json.dumps(state))
            print(json.dumps(state)); raise SystemExit(0)
    except (OSError,KeyError):
        pass
tunnel_log=root/'tunnel.log'
with tunnel_log.open('wb') as out:
    tunnel=subprocess.Popen(['cloudflared','tunnel','--no-autoupdate','--protocol','http2','--url','http://127.0.0.1:8765'],stdout=out,stderr=out,start_new_session=True)
for attempt in range(160):
    found=re.search(r'https://[a-z0-9-]+\\.trycloudflare\\.com',tunnel_log.read_text(errors='replace'))
    if found:
        state={'url':found.group(0),'serverPid':server_pid,'tunnelPid':tunnel.pid,'protocol':'http2'}
        state_file.write_text(json.dumps(state))
        print(json.dumps(state)); break
    if tunnel.poll() is not None: raise RuntimeError('HTTP tunnel exited; inspect tunnel log')
    time.sleep(.25)
else:
    raise RuntimeError('HTTP tunnel URL timeout; process and log retained')
'''
(root / "bootstrap.local.py").write_text(bootstrap, encoding="utf-8")
print("Prepared private bootstrap; token omitted from output")
