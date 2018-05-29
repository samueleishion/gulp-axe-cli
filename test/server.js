var express = require('express')
var path = require('path')
var app = express()

app.use(express.static(path.join(__dirname, '/pages')))

app.listen(3297)
