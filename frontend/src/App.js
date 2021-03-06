import {useCallback, useEffect, useState, useRef} from 'react'
import {Switch, Route, useHistory} from 'react-router-dom'

import axios from './util/axios'
import * as urls from './util/urls'
import * as api from './util/api'
import {LS_TOKEN} from './util/constants'
import UserContext from './contexts/UserContext'
import NotificationsContext from './contexts/NotificationsContext'
import FriendRequestsNumberContext from './contexts/FriendRequestsNumberContext'
import initNotifications from './util/initNotifications'
import socket from './util/socket'

import Auth from './components/Auth/Auth'
import Profile from './components/Profile/Profile'
import Navigation from './components/Navigation/Navigation'
import Spinner from './components/Spinner/Spinner'
import Friends from './components/Friends/Friends'
import {ChatIcon, CreateChatIcon} from './components/Icons/Icons'
import Chat from './components/Chat/Chat'
import NewChat from './components/Chat/NewChat'
import Feed from './components/Feed/Feed'

function App() {
  const userContext = useState(null)
  const setUser = userContext[1]

  const activeChatRef = useRef(null)
  const setActiveChat = useCallback(data => {
    activeChatRef.current = data
  }, [])

  const notificationsContext = useState({})
  const [notifications, setNotifications] = notificationsContext

  const friendRequestsNumberContext = useState(0)

  const [loading, setLoading] = useState(true)
  const history = useHistory()

  const handleInitIO = useCallback(() => {
    const io = socket.init()

    io.on('chat-message', data => {
      const {chatSlug, message} = data

      if (activeChatRef.current === chatSlug) return //oposite case handled in /src/components/Chat/Chat.js

      setNotifications((notifications) => {
        if (!notifications[chatSlug]) {
          return {
            ...notifications,
            [chatSlug]: [message]
          }
        }
        else {
          return {
            ...notifications,
            [chatSlug]: [
              ...notifications[chatSlug],
              message
            ]
          }
        }
      })
    })

    io.on('unauthorized', () => {
      history.push(`${urls.UNAUTHENTICATED}/known`)
      setNotifications({})
      setUser(null)
    })
  }, [setNotifications, setUser, history])

  useEffect(() => {
    const token = localStorage.getItem(LS_TOKEN.KEY)
    if (!token) {
      history.push(`${urls.UNAUTHENTICATED}?new`)
      return setLoading(false)
    }
    if (token === LS_TOKEN.LOGGED_OUT) {
      history.push(`${urls.UNAUTHENTICATED}?known`)
      return setLoading(false)
    }
    axios.get(api.AUTO_LOGIN)
      .then(res => {
        setUser(res.data)

        return axios.get(api.NOTIFICATIONS_COUNT)
          .then(res => {
            setNotifications(initNotifications(res.data))

            handleInitIO()

            setLoading(false)

            if(history.location.pathname === urls.SLASH ||
                history.location.pathname.includes(urls.UNAUTHENTICATED)) {
              history.push(urls.FEED)
            }
          })
      })
      .catch(() => {
        history.push(`${urls.UNAUTHENTICATED}?known`)
        return setLoading(false)
      })
  }, [history, setUser, setNotifications, handleInitIO])

  if (loading) return <Spinner/>

  return (
    <Switch>
      <UserContext.Provider value={userContext}>
        <NotificationsContext.Provider value={notificationsContext}>
          <FriendRequestsNumberContext.Provider value={friendRequestsNumberContext}>
            <Route render={({location}) =>
              [urls.UNAUTHENTICATED, urls.CHAT, urls.NEW_CHAT].some(url => location.pathname.includes(url))
                ? null
                : <>
                  <Navigation/>
                  {location.pathname === urls.FEED
                    ? <CreateChatIcon/>
                    : <ChatIcon notifications={Object.keys(notifications).length}/>
                  }
                </>
            }/>
            <Route path={urls.FRIENDS}>
              <Friends/>
            </Route>
          </FriendRequestsNumberContext.Provider>
          <Route path={urls.UNAUTHENTICATED}>
            <Auth onInitIO={handleInitIO}/>
          </Route>
          <Route path={urls.PROFILE}>
            <Profile/>
          </Route>
          <Route path={urls.FEED}>
            <Feed/>
          </Route>
          <Route path={urls.CHAT}>
            <Chat activeChatRef={activeChatRef} onSetActiveChat={setActiveChat}/>
          </Route>
          <Route path={urls.NEW_CHAT}>
            <NewChat/>
          </Route>
        </NotificationsContext.Provider>
      </UserContext.Provider>
    </Switch>
  )
}

export default App