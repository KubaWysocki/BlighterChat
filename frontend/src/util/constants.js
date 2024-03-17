export const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'
export const LS_TOKEN = {
  KEY: 'TOKEN',
  PRESENT: 'PRESENT',
  LOGGED_OUT: 'LOGGED_OUT',
}