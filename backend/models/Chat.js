const mongoose = require('mongoose')
const URLSlugs = require('mongoose-url-slugs')

const Message = require('./Message')
const {modelNames} = require('../util/constants')

const Schema = mongoose.Schema

const chatSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  users: [{
    type: Schema.Types.ObjectId, ref: modelNames.USER
  }],
  messages: [{
    type: Schema.Types.ObjectId, ref: modelNames.MESSAGE
  }]
})

chatSchema.plugin(URLSlugs('name'))

chatSchema.methods.getMessages = async function(userId) {
  await Message.updateMany({_id: {$in: this.messages}}, {$addToSet: {readList: userId}})
  return this.execPopulate({
    path: 'messages',
    select: '-_id -__v',
    populate: {
      path: 'user',
      select: '-__v -_id -chats -friendRequests -friends -email'
    }
  })
}

module.exports = mongoose.model('Chat', chatSchema)