import {io} from 'socket.io-client'

import {BASE_URL} from './constants'

let instance

const socket = {
  init: query => {
    instance = io(BASE_URL, {query})
    return instance
  },
  get: () => instance
}

export default socket