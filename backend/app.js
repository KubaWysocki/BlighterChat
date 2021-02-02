const express = require('express')
require('express-async-errors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

const {MONGO_DB_URI, MONGO_DB_CONNECTION_OPTIONS} = require('./util/constants')

const io = require('./util/socket')

const isAuth = require('./middleware/isAuth')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const userSetRoutes = require('./routes/usersSet')
const chatRoutes = require('./routes/chats')
const feedRoutes = require('./routes/feed')

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(authRoutes)

app.use(isAuth)

app.use(userRoutes)
app.use(userSetRoutes)

app.use(chatRoutes)
app.use(feedRoutes)

app.use(errorHandler)

mongoose.connect(MONGO_DB_URI, MONGO_DB_CONNECTION_OPTIONS)
  .then(() => {
    console.log('running!!') //eslint-disable-line
    const server = app.listen(8000)
    io.init(server)
  })
  .catch(err => {
    console.log(err) //eslint-disable-line
  })