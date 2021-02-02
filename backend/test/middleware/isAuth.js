const expect = require('chai').expect
const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const isAuth = require('../../middleware/isAuth')
const User = require('../../models/User')
const {MONGO_DB_TEST_URI, MONGO_DB_CONNECTION_OPTIONS} = require('../../util/constants')

describe('isAuth middleware', () => {
  let user

  before(async() => {
    await mongoose.connect(MONGO_DB_TEST_URI, MONGO_DB_CONNECTION_OPTIONS)
    user = await new User({
      email: 'test@test.com',
      username: 'test',
      password: 'password',
    }).save()
  })

  after(async() => {
    await User.deleteMany({})
    await mongoose.disconnect()
  })

  afterEach(() => sinon.restore())

  it('should throw error if no auth cookie is present', async() => {
    const req = {
      cookies: {}
    }
    const error = await isAuth(req, {}, () => null)
    expect(error).to.have.property('status', 401)
    expect(error).to.have.property('message', 'Not authenticated')
  })

  it('should throw error if auth cookie is invalid', async() => {
    const req = {
      cookies: {JWT: 'invalid cookie for sure'}
    }
    const error = await isAuth(req, {}, () => null)
    expect(error).to.have.property('status', 401)
    expect(error).to.have.property('message', 'Not authenticated')
  })

  it('should throw error if there is no user', async() => {
    const req = {
      cookies: {JWT: 'somehow valid token for unexisting user'}
    }
    sinon.stub(jwt, 'verify')
    jwt.verify.returns({_id: '507f191e810c19729de860ea'}) //fake but valid mongodb _id

    const error = await isAuth(req, {}, () => null)
    expect(error).to.have.property('status', 401)
    expect(error).to.have.property('message', 'User not found')
  })

  it('should attach user to request', async() => {
    const req = {
      cookies: {JWT: 'lets say it is valid'}
    }
    sinon.stub(jwt, 'verify')
    jwt.verify.returns({_id: user._id})

    await isAuth(req, {}, () => null)
    expect(req).to.have.property('user')
    expect(req.user._id.toString()).to.equal(user._id.toString())
  })
})