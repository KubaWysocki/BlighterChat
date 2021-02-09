const expect = require('chai').expect
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const mock = require('../../mock')
const authController = require('../../../controllers/auth')

describe('autoLogin auth controllers', function() {

  it('create token, set cookie and send response', async function() {
    sinon.stub(jwt, 'sign')
    jwt.sign.returns('token')

    const req = new mock.Request({}, await mock.User())
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
    await mock.User.deleteAllUsers()
  })
})