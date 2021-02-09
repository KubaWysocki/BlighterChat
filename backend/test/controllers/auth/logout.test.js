const expect = require('chai').expect

const mock = require('../../mock')
const authController = require('../../../controllers/auth')

describe('logout auth controllers', function() {

  it('clear cookie and send response', async function() {
    const existingUser = await mock.User()

    const req = {
      user: existingUser
    }
    const res = new mock.Response()
    await authController.logout(req, res)

    expect(res.clearCookie.calledOnceWithExactly('JWT')).to.be.true
    expect(res.status.calledOnceWithExactly(205)).to.be.true
    expect(res.json.calledOnce).to.be.true

    await mock.User.deleteAllUsers()
  })
})