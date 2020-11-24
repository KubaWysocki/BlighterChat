const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const usersRoutes = require('./routes/users')

const MONGO_DB_URI = 'mongodb://localhost:27017/blighterChat'

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET POST PUT PATCH  DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use(usersRoutes)

mongoose.connect(MONGO_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('running!!') //eslint-disable-line
    app.listen(8000)
  })
  .catch(err => {
    console.log(err) //eslint-disable-line
  })