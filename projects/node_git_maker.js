const readline = require('readline')
const { exec } = require('child_process')
const path = require('path')

function myInterface (prompt) {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt,
  })
}

//==================================
//========= About options ==========
//==================================

const url = process.argv[process.argv.length - 1]

// Options:

// --http-pass=""  пароль пользователя для https репозитория
// --dir=""  название директории в которую будет склонирован проэкт
// --branch=""  название ветки которая должна быть склонирована
// --git-user-name=""  имя гит пользователя
// --git-user-email=""  email гит пользователя
// --ssh-key-path="" путь к ключу ssh (если не указан используем системный, если указан но файла нет генерируем)

const flagNames = {
  httpUser: '--http-user',
  httpPas: '--http-pas',
  dir: '--dir',
  gitBranch: '--branch',
  gitName: '--git-user-name',
  gitEmail: '--git-user-email',
  sshPath: '--ssh-key-path'
}

const flags = [
  { name: flagNames.httpUser, value: '' },
  { name: flagNames.httpPas, value: '' },
  { name: flagNames.dir, value: '' },
  { name: flagNames.gitBranch, value: '' },
  { name: flagNames.gitName, value: '' },
  { name: flagNames.gitEmail, value: '' },
  { name: flagNames.sshPath, value: '' }
]

//get flags
for (let i = 0; i < process.argv.length; i++) {
  if (i === 0 || i === 1 || i === process.argv.length - 1) {
    continue
  }
  const name = process.argv[i].split('=')[0]
  const value = process.argv[i].split('=')[1].match(/[^"]+/)[0]
  flags.forEach((item, i) => {
    if (flags[i].name === name) {
      flags[i].value = value
    }
  })
}

//check flag
const checkFlag = (name) => {
  return flags.filter(item => item.name === name)[0].value
}

//interface for set flag
function checkAndInterfaceSetFlag (prompt, flag, callback) {
  if (!checkFlag(flag)) {
    const interfaceFlag = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt,
    })
    interfaceFlag.prompt()
    interfaceFlag.on('line', function (msg) {
      flags.forEach((item, i) => {
        if (item.name === flag) {
          flags[i].value = msg
        }
      })
      interfaceFlag.close()
      callback()
    })
  }
}

const checkFlags = {
  checkFlagDir (cb) {
    checkAndInterfaceSetFlag('Where you will save your repository? ', flagNames.dir, cb)
  },

  checkFlagHttpUser (cb) {
    checkAndInterfaceSetFlag('Say your git username for private clone: ', flagNames.httpUser,
      ()=>checkAndInterfaceSetFlag('Say your git password for private clone: ', flagNames.httpPas, cb))
  },

  checkFlagGit (cb) {
    checkAndInterfaceSetFlag('Say your git name', flagNames.gitName,
      ()=>checkAndInterfaceSetFlag('Say your git email', flagNames.gitEmail,
        ()=>checkAndInterfaceSetFlag('Say your git branch', flagNames.gitBranch, cb)))
  },

  checkSshPath (cb) {
    checkAndInterfaceSetFlag('Where your ssh key? (only path, without id_rsa) ', flagNames.sshPath, cb)
  }
}

function urlBad () {
  console.log(`Url isn't right. Try again!`)
}

//=======================================
//============ Main program =============
//=======================================

getDirPath(url)

function getDirPath (url) {
  checkFlags.checkFlagDir(next)

  function next () {
    flags.forEach((item, i) => {
      if (item.name === flagNames.dir) {
        flags[i].value = path.resolve(item.value)
      }
    })
    if (url.includes('git@')) {
      createSshCommand()
    } else if (url.includes('https')) {
      createHttpsCommand()
    } else {
      urlBad()
    }
  }
}

function createSshCommand () {
  const sshCommand = myInterface(
    `What about your ssh? ('system', 'myPath', 'dontHave') `)
  sshCommand.prompt()
  sshCommand.on('line', function (msg) {
    switch (msg) {
      case 'system':
        sshCommand.close()
        clone()
        break
      case 'myPath':
        sshCommand.close()
        checkFlags.checkSshPath(copyAndCloneSshKey)
        break
      case 'dontHave':
        sshCommand.close()
        checkFlags.checkSshPath(genCopyCloneSshKey)
        break
      default:
        console.log(
          `Your message dont right, pls only 'system', 'myPath', 'dontHave`)
        sshCommand.prompt()
    }
  })
}

function createHttpsCommand () {
  const httpsCommand = myInterface(
    `What about your https? ('private', 'public') `)
  httpsCommand.prompt()
  httpsCommand.on('line', function (msg) {
    switch (msg) {
      case 'private':
        httpsCommand.close()
        checkFlags.checkFlagHttpUser(httpClone)
        function httpClone () {
          const urlPrivate = `https://${checkFlag(flagNames.httpUser)}:${checkFlag(flagNames.httpPas)}@${url.split('://')[1]}`
          exec(`git clone ${urlPrivate}`)
        }
        break
      case 'public':
        httpsCommand.close()
        exec(`git clone ${url}`)
        break
      default:
        console.log(
          `Your message dont right, pls only 'private', 'public'`)
        httpsCommand.prompt()
    }
  })
}

function clone () {
  exec(`git clone ${url} ${checkFlag(flagNames.dir)}`)
}

function genCopyCloneSshKey(){
  console.log(`${path.join(checkFlag(flagNames.sshPath))}`)
  exec(`ssh-keygen -t rsa -b 2048 -f ${path.join(checkFlag(flagNames.sshPath)+'id_rsa')}`, function(a,s,d){
    console.log(a,s,d)
    copyAndCloneSshKey()
  })
}

function copyAndCloneSshKey(){
  exec(`cat ${path.join(checkFlag(flagNames.sshPath)+'id_rsa.pub')}`, function(err, stdout){
    console.log(stdout)
    const sshCopy = myInterface('Did you copy to git your key? (yes/no)')
    sshCopy.prompt()
    sshCopy.on('line', function(msg){
      if (msg === 'yes'){
        sshCopy.close()
        cloneSshKey(path.join(checkFlag(flagNames.sshPath)+'id_rsa.pub'))
      }
    })
  })
}

function cloneSshKey(pathSsh){
  exec(`bash -c 'GIT_SSH_COMMAND="ssh -i ${pathSsh} -F /dev/null" git clone ${url} ${checkFlag(flagNames.dir)}'`)
}

// function userGitConfig () {
//   checkFlags.checkFlagGit()
//   exec(`git config user.name ${msg}`, [], function (err, stdout) {
//     exec('git config user.name', [], function (err, stdout) {
//       console.log(`Your user name ${stdout}`)
//     })
//   })
//
//   exec(`git config user.email ${msg}`, [], function (err, stdout) {
//     exec('git config user.email', [], function (err, stdout) {
//       console.log(`Your user email ${stdout}`)
//     })
//   })
// }

