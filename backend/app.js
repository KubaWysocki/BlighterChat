const express = require('express')
require('express-async-errors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const {MONGO_DB_URI} = require('./util/constants')
const decodeToken = require('./util/decodeToken')

const isAuth = require('./middleware/isAuth')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')


const app = express()

app.use(bodyParser.json())

app.use(cors())

app.use(authRoutes)

app.use(isAuth)

app.use(usersRoutes)

app.use(errorHandler)

mongoose.connect(MONGO_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('running!!') //eslint-disable-line
    const server = app.listen(8000)
    const ioInstance = require('./util/socket')
    const io = ioInstance.init(server)
    io.on('connection', socket => {
      const {_id} = decodeToken(socket.request._query.token)
      ioInstance.connected.push({userId: _id, socketId: socket.id})
    })
    io.on('disconnect', socket => {
      ioInstance.connected = ioInstance.connected.filter(con => con.socketId !== socket.id)
    })
  })
  .catch(err => {
    console.log(err) //eslint-disable-line
  })