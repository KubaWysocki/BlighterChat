const User = require('../models/User')
const ApiError = require('./ApiError')
const decodeToken = require('./decodeToken')

let io
module.exports = {
  init: server => {
    io = require('socket.io')(server, {
      cors: {
        origin: '*',
      }
    })

    io.on('connection', async socket => {
      const {_id} = decodeToken(socket.request._query.token)
      socket.user = await (await User.findOne({_id})).execPopulate('chats')
      socket.user.chats.forEach(chat => {
        socket.join(chat.slug)
      })
    })

    return io
  },
  get: () => {
    if(!io) throw ApiError(500, 'Socket not initialized')
    return io
  },
  getActiveConnection: (user, callback) => {
    if (!io) throw ApiError(500, 'Socket not initialized')
    const activeConnections = io.sockets.sockets //Map
    let connection = null
    for (let [key, value] of activeConnections) {
      if (user._id.equals(value.user._id)) connection = key
    }
    if (connection) callback(io, connection)
  }
}