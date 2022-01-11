import axios from 'axios'

import {BASE_URL} from './constants'

const instance = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true
})

export default instance