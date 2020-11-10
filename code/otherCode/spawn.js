const { spawn } = require('child_process');


const child = spawn('wc', ['-l']);

child.on('exit', (code, signal) => {
  console.log(
    `child process exited with code ${code} and signal ${signal}`
  );
});
process.stdin.pipe(child.stdin);
child.stdout.on('data', (data) => {
  console.log(`child stdout: `, data.toString());
});
child.stderr.on('data', (data) => {
  console.error(`child stderr:\n${data}`);
});

//==================================

