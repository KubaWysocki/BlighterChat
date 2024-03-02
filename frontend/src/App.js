import React, {useCallback, useEffect, useState, useRef} from 'react'
import {Switch, Route, useHistory} from 'react-router-dom'

import axios from './util/axios'
import * as urls from './util/urls'
import * as api from './util/api'
import {LS_TOKEN} from './util/constants'
import UserContext from './contexts/UserContext'
import NotificationsContext from './contexts/NotificationsContext'
import FriendRequestsNumberContext from './contexts/FriendRequestsNumberContext'
import socket from './util/socket'

import Auth from './components/Auth/Auth'
import Profile from './components/Profile/Profile'
import Navigation from './components/Navigation/Navigation'
import Spinner from './components/Spinner/Spinner'
import Friends from './components/Friends/Friends'
import {ChatIcon} from './components/Icons/Icons'
import Chat from './components/Chat/Chat'
import NewChat from './components/Chat/NewChat'
import Feed from './components/Feed/Feed'
import {Box, Divider, useMediaQuery} from '@material-ui/core'

function App() {
  const userContext = useState(null)
  const setUser = userContext[1]

  const activeChatSlugRef = useRef(null)
  const setActiveChatSlug = useCallback(data => {
    activeChatSlugRef.current = data
  }, [])

  const notificationsContext = useState({})
  const [notifications, setNotifications] = notificationsContext

  const friendRequestsNumberContext = useState(0)

  const [loading, setLoading] = useState(true)
  const history = useHistory()

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('xs'))

  const handleInitIO = useCallback(() => {
    const io = socket.init()

    io.on('chat-message', chat => {

      if (activeChatSlugRef.current === chat.slug) return //oposite case handled in /src/components/Chat/Chat.js

      setNotifications((notifications) => {
        if (!notifications[chat.slug]) {
          return {
            ...notifications,
            [chat.slug]: chat
          }
        }
        else {
          return {
            ...notifications,
            [chat.slug]: {
              ...chat,
              messages: [
                ...chat.messages,
                ...notifications[chat.slug].messages,
              ]
            }
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
            setNotifications(res.data)

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

  const auth = <Auth onInitIO={handleInitIO}/>

  const sharedElements = <>
    <Route path={urls.PROFILE}>
      <Profile/>
    </Route>
    <Route path={urls.FRIENDS}>
      <Friends/>
    </Route>
    <Route path={urls.CHAT}>
      <Chat activeChatSlugRef={activeChatSlugRef} setActiveChatSlug={setActiveChatSlug}/>
    </Route>
    <Route path={urls.NEW_CHAT}>
      <NewChat/>
    </Route>
  </>

  const mainView = isSmallScreen
    ? <>
      <Route path={urls.UNAUTHENTICATED}>
        {auth}
      </Route>
      <Route render={({location}) =>
        ![urls.UNAUTHENTICATED, urls.CHAT, urls.NEW_CHAT].some(url => location.pathname.includes(url)) &&
          <>
            <Navigation/>
            {!location.pathname.includes(urls.FEED) && <ChatIcon notificationsNumber={Object.keys(notifications).length}/>}
          </>
      }/>
      <Route path={urls.FEED}>
        <Box pt={6} height={1}>
          <Feed/>
        </Box>
      </Route>
      {sharedElements}
    </>
    : <>
      <Route render={({location}) => !location.pathname.includes(urls.UNAUTHENTICATED)
        ? <Box display='flex' position='relative' height={1}>
          <Navigation/>
          <Box display="flex" width={.3} height={1} pt={6}>
            <Feed/>
            <Divider orientation='vertical'/>
          </Box>
          <Box width={.7} pt={6} position="relative">
            {sharedElements}
          </Box>
        </Box>
        : auth
      }/>
    </>

  return (
    <Switch>
      <UserContext.Provider value={userContext}>
        <NotificationsContext.Provider value={notificationsContext}>
          <FriendRequestsNumberContext.Provider value={friendRequestsNumberContext}>
            {mainView}
          </FriendRequestsNumberContext.Provider>
        </NotificationsContext.Provider>
      </UserContext.Provider>
    </Switch>
  )
}

export default App