var log = console.log.bind(console)

var fs = require('fs')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
app.use(express.static('static'))
app.use(bodyParser.json())

var todoList = []

var sendHTML = (path, response) => {
    var options = {
        encoding: "utf-8"
    }
    fs.readFile(path, options, (error, data) => {
        response.send(data)
    })
}

var sendJSON = (data, response) => {
    var data = JSON.stringify(data)
    response.send(data)
}

app.get('/', (request, response) => {
    var path = "./index.html"
    sendHTML(path, response)
})

app.get('/todo/all', (request, response) => {
    sendJSON(todoList, response)
})

var addTodo = data => {
    var length = todoList.length
    if (length === 0) {
        data.id = 0
    } else {
        index = todoList[length - 1].id + 1
        data.id = index
    }
    todoList.push(data)
    return data
}

app.post('/todo/add', (request, response) => {
    var data = request.body
    var data = addTodo(data)
    sendJSON(data, response)
})

var deleteTodo = id => {
    var id = Number(id)
    for (var i = 0; i < todoList.length; i++) {
        if (todoList[i].id === id) {
            var chosenTodo = todoList.splice(i, 1)[0]
            return chosenTodo
        }
    }
}

app.get('/todo/delete/:id', (request, response) => {
    var id = request.params.id
    var data = deleteTodo(id)
    sendJSON(data, response)
})

var editTodo = data => {
    var id = data.id
    var task = data.todo
    for (var i = 0; i < todoList.length; i++) {
        if (todoList[i].id === id) {
            todoList[i].task = task
            return todoList[i]
        }
    }
}

app.post('/todo/edit', (request, response) => {
    var data = request.body
    var data = editTodo(data)
    sendJSON(data, response)
})

var server = app.listen('8000', () => {
    var host = server.address().address
    var port = server.address().port
    log(`根目录是：http://${host}:${port}`)
})
