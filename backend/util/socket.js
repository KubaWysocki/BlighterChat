const cookie = require('cookie')

const User = require('../models/User')
const ApiError = require('./ApiError')
const decodeToken = require('./decodeToken')
const {ALLOWED_HOST} = require('./constants')

let io
module.exports = {
  init: server => {
    io = require('socket.io')(
      server,
      process.env.NODE_ENV === 'development'
        ? {cors: {origin: ALLOWED_HOST, credentials: true}}
        : {allowRequest: (req, callback) => callback(null, req.headers.origin === undefined)}
    )

    io.on('connection', async socket => {
      const cookies = cookie.parse(socket.handshake.headers.cookie || '')
      if (cookies.JWT) {
        const {_id} = decodeToken(cookies.JWT)
        socket.user = await (await User.findOne({_id}))?.populate('chats')
        socket.user?.chats.forEach(chat => {
          socket.join(chat.slug)
        })
      }
      else {
        io.to(socket.id).emit('unauthorized')
      }
    })

    return io
  },
  get: () => {
    if(!io) throw ApiError(500, 'Socket not initialized')
    return io
  },
  getActiveConnection: (user, callback) => {
    if (!io) throw new ApiError(500, 'Socket not initialized')
    const activeConnections = io.sockets.sockets //Map
    let socket = null
    for (let [key, value] of activeConnections) {
      if (user._id.equals(value.user._id)) socket = [key, value]
    }
    if (socket) callback(io, socket)
  }
}