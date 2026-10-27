// Generalized detached task-scheduler launcher.
// Usage: node detached-launcher.cjs <path-to-bat>
// Creates a one-off schtasks entry and /runs it. The bat survives the calling shell.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const bat = process.argv[2];
if (!bat) { console.error('usage: node detached-launcher.cjs <path-to-bat>'); process.exit(2); }
const dir = path.dirname(path.resolve(bat));
const logPath = path.join(dir, 'detached-launcher.log');
const log = fs.openSync(logPath, 'a');
const ts = new Date().toISOString();
fs.writeSync(log, `\n==== ${ts} launcher bat=${bat} ====`);

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  if (r.status !== 0) fs.writeSync(log, `\n[err ${cmd} ${args.join(' ')}]\nSTDOUT: ${r.stdout}\nSTDERR: ${r.stderr}`);
  return r;
}

const taskName = 'hf_detached_' + process.pid + '_' + Date.now().toString(36);
run('schtasks', ['/delete', '/tn', taskName, '/f']);
const future = new Date(Date.now() + 120000);
const st = String(future.getHours()).padStart(2, '0') + ':' + String(future.getMinutes()).padStart(2, '0');
let r = run('schtasks', ['/create', '/tn', taskName, '/tr', bat, '/sc', 'once', '/st', st, '/f']);
fs.writeSync(log, `\ntask create rc=${r.status} st=${st}\n`);
r = run('schtasks', ['/run', '/tn', taskName]);
fs.writeSync(log, `\ntask run rc=${r.status}\n`);
  // Borrador inmediato: evita el 2° disparo programado en horario futuro.
  const dl = run('schtasks', ['/delete', '/tn', taskName, '/f']);
  fs.writeSync(log, `\ntask delete rc=${dl.status}\n`);
  console.log('orphan task=' + taskName + ' (deleted)');
  fs.writeFileSync(path.join(dir, 'latest-task'), taskName);
  fs.writeFileSync(path.join(dir, 'latest-task'), taskName);