import axios from 'axios'

import {BASE_URL} from './constants'

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export default instance