const fs = require('fs')
const path = require('path')
const readline = require('readline')

const getFileName = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

getFileName.question('Title of file:', fileName=>{
  console.log(fileName)
  function readFile(fileName) {
    return fs.createReadStream(path.resolve(fileName), { highWaterMark: 50 })
  }

  const hey = readFile(fileName)
  hey.on('data', function(res){
    console.log(res.toString().toUpperCase())
    const last = Date.now()
    while(Date.now() - last  <= 2000);
  })
})


