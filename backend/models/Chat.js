const mongoose = require('mongoose')
const URLSlugs = require('mongoose-url-slugs')

const Message = require('./Message')
const {modelNames, pageSizes} = require('../util/constants')

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
  }],
  blocked: {
    type: Boolean,
    default: false,
  }
}, {timestamps: true})

chatSchema.plugin(
  URLSlugs('name', {generator: (text) =>
    text.toLowerCase().replace(/^[-_~]([^a-z0-9\-_~]+)[-_~]$/g, '')}
  )
)

chatSchema.methods.getMessages = async function(userId, page) {
  await Message.updateMany({_id: {$in: this.messages}}, {$addToSet: {readList: userId}})

  return this.execPopulate({
    path: 'messages',
    select: '-_id -__v',
    populate: [{
      path: 'user',
      select: '-__v -_id -chats -friendRequests -friends -email'
    },
    {
      path: 'readList',
      select: '-__v -_id -chats -friendRequests -friends -email'
    }],
    options: {
      sort: '-timestamp',
      skip: Number(page) * pageSizes.MESSAGES,
      limit: pageSizes.MESSAGES,
    }
  })
}

module.exports = mongoose.model('Chat', chatSchema)