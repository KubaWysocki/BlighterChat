import {io} from 'socket.io-client'

import {BASE_URL} from './constants'

let instance

const socket = {
  init: () => {
    instance = io(BASE_URL, {withCredentials: true})
    return instance
  },
  get: () => instance
}

export default socket