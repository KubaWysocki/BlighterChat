const express = require('express')
const bodyParser = require('body-parser')

const usersRoutes = require('./routes/users')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET POST PUT PATCH  DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use(usersRoutes)

app.listen(8000)
console.log('running')