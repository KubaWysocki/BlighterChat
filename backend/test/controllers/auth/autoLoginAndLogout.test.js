const expect = require('chai').expect
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const mock = require('../../mocks')
const authController = require('../../../controllers/auth')

describe('autoLogin and logout controllers auth', function() {

  let req
  before(async function() {
    const existingUser = await mock.User()

    req = {
      user: existingUser
    }
  })

  after(function() {
    return mock.User.deleteAllUsers()
  })

  it('should autoLogin -> create token, set cookie and send response', async function() {
    sinon.stub(jwt, 'sign')
    jwt.sign.returns('token')

    const res = new mock.Response()
    await authController.autoLogin(req, res)

    expect(res.status.calledOnceWithExactly(202)).to.be.true
    expect(res.cookie.calledOnceWith('JWT', 'token')).to.be.true
    expect(res.json.calledOnceWithExactly({
      email: req.user.email,
      username: req.user.username,
      slug: req.user.slug
    })).to.be.true

    sinon.restore()
  })

  it('should logout -> clear cookie and send response', async function() {
    const res = new mock.Response()
    await authController.logout(req, res)

    expect(res.clearCookie.calledOnceWithExactly('JWT')).to.be.true
    expect(res.status.calledOnceWithExactly(205)).to.be.true
    expect(res.json.calledOnce).to.be.true
  })
})