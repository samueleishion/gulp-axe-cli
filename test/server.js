var express = require('express')
var app = express()

app.use(express.static('pages'))

process.on('SIGINT', function () {
  app.close(function () {
    process.exit(0)
  })
})

app.listen(3297)
