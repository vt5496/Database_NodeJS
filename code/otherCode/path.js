const path = require('path')

const pathResolve = path.resolve(__dirname, '../')
const pathJoin = path.join(__dirname, '../')

const pathResolve2 = path.resolve('hello/', '../')
const pathJoin2 = path.join('hello/', '../')

const pathResolve3 = path.resolve('/hello/etc', '/')
const pathJoin3 = path.join('/hello/etc', '/')

console.log(`Resolve: ${pathResolve}
Join: ${pathJoin}
`)

console.log(`Resolve: ${pathResolve2}
Join: ${pathJoin2}`)

console.log(`Resolve: ${pathResolve3}
Join: ${pathJoin3}`)