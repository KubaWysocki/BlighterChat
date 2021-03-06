exports.MONGO_DB_URI = 'mongodb://localhost:27017/blighterChat'
exports.MONGO_DB_TEST_URI = 'mongodb://localhost:27017/test_blighterChat'
exports.MONGO_DB_CONNECTION_OPTIONS = {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}

exports.AUTH_EXPIRATION_TIME = String(1000 * 60 * 60 * 48)

exports.modelNames = {
  USER: 'User',
  CHAT: 'Chat',
  MESSAGE: 'Message'
}

exports.pageSizes = {
  USERS: 15,
  FEED: 30,
  MESSAGES: 50,
}