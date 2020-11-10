const { spawn } = require('child_process');
const readline = require('readline')

const readFile = readline.createInterface({
  input: process.stdin,
  output: process.output,
  prompt: 'Filename: '
})

readFile.prompt()