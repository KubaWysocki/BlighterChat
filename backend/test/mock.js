const sinon = require('sinon')
const faker = require('faker')

const User = require('../models/User')

class Request {
  constructor(body, user, cookies) {
    this.body = body
    this.user = user
    this.cookies = cookies
  }
}
exports.Request = Request

class Response {
  constructor() {
    this.status = sinon.stub()
    this.status.returns(this)

    this.json = sinon.spy()

    this.cookie = sinon.spy()

    this.clearCookie = sinon.spy()
  }
}
exports.Response = Response

const mockUser = () =>
  new User({
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password()
  }).save()

mockUser.deleteAllUsers = () => User.deleteMany({})

exports.User = mockUser