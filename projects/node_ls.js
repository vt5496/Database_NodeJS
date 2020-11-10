const path = require('path')
const fs = require('fs')

try {

  //get arguments
  let flagsIn = process.argv[2]
  let pathIn = process.argv[3]
  //check have flags or no
  if (!pathIn) {
    pathIn = flagsIn
    flagsIn = ''
  }

  //realPath, fileName, stats of path for check file or directory
  const realPath = path.resolve(pathIn)
  const fileName = path.basename(realPath)
  const statsPath = fs.statSync(pathIn)

  //code for show info from directory
  if (statsPath.isDirectory()) {
    if (flagsIn === '-a' || flagsIn === '-h' || flagsIn === '' || flagsIn === '-ha' || flagsIn === '-ah') {
      fs.readdir(realPath, function (err, items) {
        console.log(`. ..`)
        for (let i = 0; i < items.length; i++) {
          console.log(items[i])
        }
      })
    } else if (flagsIn === '-l') {
      fs.readdir(realPath, function (err, items) {
        for (let i = 0; i < items.length; i++) {
          getFullInfo(`${realPath}/${items[i]}`, false)
        }
      })
    } else if (flagsIn === '-al' || flagsIn === '-la') {
      fs.readdir(realPath, function (err, items) {
        getFullInfo(path.resolve(realPath), false, '.')
        getFullInfo(path.resolve(realPath, '../'), false, '..')
        for (let i = 0; i < items.length; i++) {
          getFullInfo(`${realPath}/${items[i]}`, false)
        }
      })
    } else if (flagsIn === '-hl' || flagsIn === '-lh') {
      fs.readdir(realPath, function (err, items) {
        for (let i = 0; i < items.length; i++) {
          getFullInfo(`${realPath}/${items[i]}`, true)
        }
      })
    } else if (flagsIn.includes('a') && flagsIn.includes('h') &&
      (flagsIn.includes('l'))) {
      fs.readdir(realPath, function (err, items) {
        getFullInfo(path.resolve(realPath), true, '.')
        getFullInfo(path.resolve(realPath, '../'), true, '..')
        for (let i = 0; i < items.length; i++) {
          getFullInfo(`${realPath}/${items[i]}`, true)
        }
      })
    }

//code for show info from file
  } else {
    if (flagsIn === '-a' || flagsIn === '-h' || flagsIn === '' || flagsIn === '-ah' || flagsIn === '-ha') {
      console.log(fileName)
    } else if (flagsIn === '-al' || flagsIn === '-la' ||  flagsIn === '-l') {
      getFullInfo(realPath, false)
    } else if (flagsIn === '-hl' || flagsIn === '-lh' || flagsIn.includes('a') && flagsIn.includes('h') &&
      (flagsIn.includes('l'))) {
      getFullInfo(realPath, true)
    } else {
      getFullInfo(realPath, true)
    }
  }

} catch (e) {
  console.log(`Command will have structure: \tnode node_ls.js flags(-alh) fileName or
  \t\t\t\tnode node_ls.js fileName`)
}

//get and show info
function getFullInfo (file, hSize, fatherDir) {
  const stats = fs.statSync(file)

  const type = stats.isDirectory() ? 'd' : '-'

  let fileName;
  if(fatherDir) {
    fileName = fatherDir
  } else {
    fileName = path.basename(file)
  }
  const permissions = ((stats['mode'] & 1 ? 'x' : '-') +
    (stats['mode'] & 2 ? 'w' : '-') + (stats['mode'] & 4 ? 'r' : '-') +
    (stats['mode'] & 10 ? 'x' : '-') + (stats['mode'] & 20 ? 'w' : '-') +
    (stats['mode'] & 40 ? 'r' : '-') +
    (stats['mode'] & 100 ? 'x' : '-') + (stats['mode'] & 200 ? 'w' : '-') +
    (stats['mode'] & 400 ? 'r' : '-')).split('').reverse().join('')

  const size = hSize ? `${(stats.size / 1024).toFixed(1)}K` : stats.size

  const month = stats.ctime.toLocaleString('ru', {
    month: 'short',
  }).match(/[^.]+/)[0]
  const minute = stats.ctime.getMinutes() < 10
    ? `0${stats.ctime.getMinutes()}`
    : stats.ctime.getMinutes()
  const date = `${month} ${stats.ctime.getHours()}:${minute}`

  console.log(
    `${type}${permissions}\t${stats.nlink}\t${stats.uid}\t${stats.gid}\t${size}\t${date}\t${fileName}`)
}