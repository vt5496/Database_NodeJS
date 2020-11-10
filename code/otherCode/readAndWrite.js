const fs = require('fs')
const {spawn} = require('child_process')

const wc = spawn('wc', ['-l'])

const input = process.stdin;


wc.stdout.on('data', (data) => {
  fs.appendFileSync('textAppend.txt', `All wc: \n\n${data}`)
});

input.on('data', data=>{
  fs.appendFileSync(`textAppend.txt`, `Text data: \n\n${data}`)
  wc.stdin.write(data)
  wc.stdin.end();
})