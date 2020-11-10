const fs = require('fs')
const path = require('path')
const readline = require('readline')

const getFileName = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const {Worker, isMainThread, parentPort, workerData} = require('worker_threads')

if (isMainThread) {
  i = 5

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

  const worker = new Worker(__filename, { workerData: i })
  worker.on('message', msg => {
    console.log('Hello world', msg)
  })
  worker.on('error', e => {
    console.log(e)
  })
} else {
  const newData = workerData + 5;
  parentPort.postMessage(['Hello world', newData])
}