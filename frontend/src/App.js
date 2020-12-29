import {useEffect, useState} from 'react'
import {Switch, Route, useHistory} from 'react-router-dom'

import axios from './util/axios'
import * as urls from './util/urls'
import * as api from './util/api'
import {LOGGED_OUT} from './util/constants'
import UserContext from './contexts/UserContext'
import NotificationsContext from './contexts/NotificationsContext'
import socket from './util/socket'

import Auth from './components/Auth/Auth'
import Profile from './components/Profile/Profile'
import Navigation from './components/Navigation/Navigation'
import Spinner from './components/Spinner/Spinner'
import Friends from './components/Friends/Friends'
import ChatIcon from './components/ChatIcon/ChatIcon'
import Chat from './components/Chat/Chat'

function App() {
  const userContext = useState(null)
  const setUser = userContext[1]

  const [activeChat, setActiveChat] = useState(null)
  const notificationsContext = useState({})
  const [notifications, setNotifications] = notificationsContext

  const [loading, setLoading] = useState(true)
  const history = useHistory()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      history.push(`${urls.UNAUTHENTICATED}?new`)
      return setLoading(false)
    }
    if (token === LOGGED_OUT) {
      history.push(`${urls.UNAUTHENTICATED}?known`)
      return setLoading(false)
    }
    axios.get(api.AUTO_LOGIN)
      .then(res => {
        const {token, ...userData} = res.data
        localStorage.setItem('token', token)
        Object.assign(axios.defaults, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        setUser(userData)
        setLoading(false)

        socket.init({token})
          .on('chat-message', data => {
            const {chatSlug, message} = data

            if (activeChat === chatSlug) return //oposite case handled in /src/components/Chat/Chat.js

            if(!notifications[chatSlug]) {
              setNotifications({
                ...notifications,
                [chatSlug]: [message]
              })
            }
            else {
              setNotifications({
                ...notifications,
                [chatSlug]: [
                  ...notifications[chatSlug],
                  message
                ]
              })
            }
          })

        if(history.location.pathname === urls.SLASH ||
          history.location.pathname.includes(urls.UNAUTHENTICATED)) {
          history.push(urls.FEED)
        }
      })
      .catch(() => {
        history.push(`${urls.UNAUTHENTICATED}?known`)
        return setLoading(false)
      })
  }, [history, setUser, activeChat, notifications, setNotifications])

  if (loading) return <Spinner/>

  return (
    <Switch>
      <UserContext.Provider value={userContext}>
        <NotificationsContext.Provider value={notificationsContext}>
          <Route render={({location}) =>
            [urls.UNAUTHENTICATED, urls.CHAT].some(url => location.pathname.includes(url))
              ? null
              : <>
                <Navigation/>
                {location.pathname !== urls.FEED
                  && <ChatIcon notifications={Object.keys(notifications).length}/>
                }
              </>
          }/>
          <Route path={urls.UNAUTHENTICATED}>
            <Auth/>
          </Route>
          <Route path={urls.PROFILE}>
            <Profile/>
          </Route>
          <Route path={urls.FRIENDS}>
            <Friends/>
          </Route>
          <Route path={urls.CHAT}>
            <Chat onSetActiveChat={setActiveChat}/>
          </Route>
          <Route path={urls.FEED}>

          </Route>
        </NotificationsContext.Provider>
      </UserContext.Provider>
    </Switch>
  )
}

export default App