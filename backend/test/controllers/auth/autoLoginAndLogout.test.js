const expect = require('chai').expect
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const {Response} = require('../../mocks')
const authController = require('../../../controllers/auth')
const User = require('../../../models/User')

describe('autoLogin and logout controllers auth', function() {

  let req
  before(async function() {
    const existingUser = await new User({
      email: 'test@test.test',
      username: 'test',
      password: 'password'
    }).save()

    req = {
      user: existingUser
    }
  })

  after(function() {
    return User.deleteMany({})
  })

  it('should autoLogin -> create token, set cookie and send response', async function() {
    sinon.stub(jwt, 'sign')
    jwt.sign.returns('token')

    const res = new Response()
    await authController.autoLogin(req, res)

    expect(res.status.calledOnceWithExactly(202)).to.be.true
    expect(res.cookie.calledOnceWith('JWT', 'token')).to.be.true
    expect(res.json.calledOnceWithExactly({
      email: req.user.email,
      username: req.user.username,
      slug: req.user.slug
    })).to.be.true

    sinon.restore()
    await User.deleteOne({_id: req.user._id})
  })

  it('should logout -> clear cookie and send response', async function() {
    const res = new Response()
    await authController.logout(req, res)

    expect(res.status.calledOnceWithExactly(205)).to.be.true
    expect(res.json.calledOnce).to.be.true
  })
})