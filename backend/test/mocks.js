const sinon = require('sinon')

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