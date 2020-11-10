const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.createReadStream(path.resolve('imgs/image.jpg'), { highWaterMark: 2 }).pipe(res)
  } else {
    fs.createReadStream(path.resolve('text.txt'), {highWaterMark: 2}).pipe(res)
  }
})

server.listen(3000)