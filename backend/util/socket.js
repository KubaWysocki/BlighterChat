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
  connected: []
}