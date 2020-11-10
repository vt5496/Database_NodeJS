const readline = require('readline')
const fs = require('fs')
const {strict} = require('assert')

function myInterface (prompt) {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt,
  })
}

const ask = myInterface('Will you create file? (yes/no)')
ask.prompt()

try {
  ask.on('line', (msg) => {
    strict(msg === 'yes', new TypeError('Inputs are not yes!!'))
    ask.close()

    const name = myInterface('Name of directory: ')
    name.prompt()

    name.on('line', (msg2) => {
      strict(msg !== '', new TypeError('Name of dir can`t be empty'))
      fs.mkdirSync(msg2)
      name.close()
    })
  })
} catch (e) {
  console.log(e)
}

