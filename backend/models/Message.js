const mongoose = require('mongoose')
const {modelNames} = require('../util/constants')

const Schema = mongoose.Schema

const MessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, ref: modelNames.USER
  },
  content: {
    type: String,
    required: true,
  },
  readList: [{
    type: Schema.Types.ObjectId, ref: modelNames.USER
  }],
  timestamp: {
    type: Date, default: Date.now
  },
})

module.exports = mongoose.model('Message', MessageSchema)