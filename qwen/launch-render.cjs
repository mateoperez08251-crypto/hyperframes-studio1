// Launch the render fully detached so it survives the shell that spawned it.
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dir = __dirname;
const logPath = path.join(dir, 'render.log');
const logStream = fs.openSync(logPath, 'w');
const args = ['exec', '--yes', '--package', 'hyperframes@0.8.193', '--', 'hyperframes', 'render', '--quality', 'delivery', '--output', 'qwen-3.8.mp4'];
const child = spawn('npm.cmd', args, {
  cwd: dir,
  detached: true,
  stdio: ['ignore', logStream, logStream],
  windowsHide: true,
  shell: false,
});
child.on('error', (e) => { fs.appendFileSync(logPath, '\n[spawn-error] ' + e.message + '\n'); });
child.unref();
fs.writeFileSync(path.join(dir, 'render.pid'), String(child.pid));
console.log('launched detached pid=' + child.pid);
