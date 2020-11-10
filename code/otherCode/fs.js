const fs = require('fs')
const path = require('path')

fs.stat(__dirname + '/text.txt', function(err, res){
  try{
    console.log(res)
    if (res.size > 5000) {
      throw new Error('size very big')
    }
  } catch (e) {
    console.log(e)
  }
})

fs.chown(path.resolve() + '/fs.js', 1000, 1000, console.log)

fs.mkdir(path.resolve() + '/newDir', {}, function(){})

fs.readdir(path.resolve(), {}, function (err, res){
  res.forEach(i => console.log(path.resolve(i)))
})

fs.renameSync(path.resolve('chilgProccesses.js'), path.resolve('childProcesses.js'))

fs.rename(path.resolve('newDir'), path.resolve('newDir2'), function (){})