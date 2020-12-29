import {createContext} from 'react'

const NotificationsContext = createContext({
  activeChat: ['', () => {}],
  notifications: [{}, () => {}]
})

export default NotificationsContext