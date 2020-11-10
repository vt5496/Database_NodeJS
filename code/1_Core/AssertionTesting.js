// Assertion testing - проверка утверждений, есл утверждение не верно
// то выбрасывает исключение. Чаще всего используется в тестировании.

//Assert - утверждение


function capitalize(str) {
    if (str === '') return '';
    return str[0].toUpperCase() + str.slice(1)
}

if (capitalize('') !== ''){
    throw new Error('Функция работает неверно!')
}

if (capitalize('hello') !== 'Hello'){
    throw new Error('Функция работает неверно!')
}

// or with assert strict

const {strict} = require('assert')

strict(capitalize('') === '')
strict(capitalize('hello')=== 'Hello')

//test
strict(capitalize('hello world') === 'hello world')
//error
