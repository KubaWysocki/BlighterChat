const path = require('path')
const express = require('express')
require('express-async-errors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

const {MONGO_DB_URI} = require('./util/constants')

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
  origin: 'http://laptop-m3aehvfp:8000',
  credentials: true
}))

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')))

app.use('/api', authRoutes, isAuth, userRoutes, userSetRoutes, chatRoutes, feedRoutes, errorHandler)

app.use((_, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'))
})

mongoose.connect(MONGO_DB_URI)
  .then(() => {
    console.log('running!!') //eslint-disable-line
    const server = app.listen(8000)
    io.init(server)
  })
  .catch(err => {
    console.log(err) //eslint-disable-line
  })