const ApiError = require('./ApiError')

let io
module.exports = {
  init: server => {
    io = require('socket.io')(server, {
      cors: {
        origin: '*',
      }
    })
    return io
  },
  get: () => {
    if(!io) throw ApiError(500, 'Socket not initialized')
    return io
  },
  getActiveConnection: (user, callback) => {
    if(!io) throw ApiError(500, 'Socket not initialized')
    const activeConnections = io.sockets.sockets //Map
    let connection = null
    for (let [key, value] of activeConnections) {
      if(user._id.equals(value.userId)) connection = key
    }
    if (connection) callback(io, connection)
  }
}