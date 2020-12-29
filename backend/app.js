const express = require('express')
require('express-async-errors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const {MONGO_DB_URI} = require('./util/constants')

const io = require('./util/socket')

const isAuth = require('./middleware/isAuth')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const userSetRoutes = require('./routes/usersSet')
const chatRoutes = require('./routes/chats')


const app = express()

app.use(bodyParser.json())

app.use(cors())

app.use(authRoutes)

app.use(isAuth)

app.use(userRoutes)
app.use(userSetRoutes)

app.use(chatRoutes)

app.use(errorHandler)

mongoose.connect(MONGO_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('running!!') //eslint-disable-line
    const server = app.listen(8000)
    io.init(server)
  })
  .catch(err => {
    console.log(err) //eslint-disable-line
  })