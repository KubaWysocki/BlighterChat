const mongoose = require('mongoose')

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
  chats: [{
    type: Schema.Types.ObjectId, ref: modelNames.CHAT
  }]
})

userSchema.methods.addToCart = function() {

}

module.exports = mongoose.model(modelNames.USER, userSchema)