const fs = require('fs')

const buffer = Buffer.alloc(256)
const buffer2 = Buffer.from('Hello')

console.log(buffer.toString())
console.log(buffer2.toString())

const stream = fs.createReadStream('./text.txt', {highWaterMark: 20})

stream.on('data', function(res){
  console.log('new 20 byte', res)
})
