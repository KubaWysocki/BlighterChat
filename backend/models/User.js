const mongoose = require('mongoose')
const URLSlugs = require('mongoose-url-slugs')

const {modelNames} = require('../util/constants')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  friendRequests: [{
    notify: Boolean,
    user: {type: Schema.Types.ObjectId, ref: modelNames.USER}
  }],
  friends: [{
    type: Schema.Types.ObjectId, ref: modelNames.USER
  }],
  chats: [{
    type: Schema.Types.ObjectId, ref: modelNames.CHAT
  }],
})

userSchema.plugin(URLSlugs('username'))

userSchema.methods.getFriendRequests = function() {
  return this.execPopulate({
    path: 'friendRequests.user',
    select: '-_id username email slug'
  })
}

module.exports = mongoose.model(modelNames.USER, userSchema)