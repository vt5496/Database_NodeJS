//Async hooks - позволяет отслеживать изменения в асинхронных ресурсах.

const asyncHooks = require('async_hooks')
const http = require('http')
const fs = require('fs')

//Вы начинаете с инициализации его объектом колбеков: init, before, after и destroy.

const hooks = {
    init
}

const asyncHook = asyncHooks.createHook(hooks)


asyncHook.enable()

http.createServer(function(req, res){
    res.end('hello qts\n')
}).listen(3000)

function init(asyncId, type, triggerId){
    fs.writeSync(1, `Type: ${type}, trigger id ${triggerId}, asyncId: ${asyncId}\n`)
}