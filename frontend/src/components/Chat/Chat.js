import {useEffect, useState, useCallback, useMemo, useContext} from 'react'
import {useHistory, useLocation, useRouteMatch} from 'react-router-dom'

import axios from '../../util/axios'
import UserContext from '../../contexts/UserContext'
import NotificationsContext from '../../contexts/NotificationsContext'
import * as api from '../../util/api'
import * as urls from '../../util/urls'
import ChatInput from './ChatInput'
import Messages from './Messages'
import ChatTopBar from './ChatTopBar'
import socket from '../../util/socket'

const Chat = ({onSetActiveChat}) => {
  const [user] = useContext(UserContext)
  const [notifications, setNotifications] = useContext(NotificationsContext)
  const history = useHistory()
  const {params} = useRouteMatch('/chat/:slug?')
  const {search, state: routeState} = useLocation()
  const [chat, setChat] = useState(null)

  const receiver = search.split('=')[1]

  const handleSetChat = useCallback((chat) => {
    const newNotifications = {...notifications}
    delete newNotifications[chat.slug]
    setNotifications(newNotifications)
    setChat(chat)
    onSetActiveChat(chat.slug)
    history.replace(`${urls.CHAT}/${chat.slug}`)
  }, [setChat, history, notifications, setNotifications, onSetActiveChat])

  useEffect(() => {
    return () => onSetActiveChat(null)
  }, [onSetActiveChat])

  useEffect(() => {
    if (!chat) {
      axios.get(`${api.GET_CHAT}${params.slug || 'findOrCreate'}${search || ''}`)
        .then(res => {
          if (res.data.newChat) return

          const chat = res.data
          socket.get().on('chat-message', data => {
            const {chatSlug, message} = data
            if (chat.slug !== chatSlug) return //oposite case handled in /src/App.js

            setChat(
              Object.assign({}, chat, {messages: [message, ...chat.messages]})
            )
          })
          handleSetChat(chat)
        })
    }
  }, [chat, search, params.slug, handleSetChat])

  const topBarName = useMemo(() => {
    if (routeState?.username) return routeState.username
    else if (chat) {
      if (chat.users.length > 2) {
        return chat.name
      }
      else {
        return chat.users.find(u => u.username !== user.username).username
      }
    }
    else return receiver
  }, [chat, receiver, routeState?.username, user.username])

  return <>
    <ChatTopBar name={topBarName}/>
    <Messages messages={chat?.messages}/>
    <ChatInput chat={chat} receiver={receiver} onSetChat={handleSetChat}/>
  </>
}

export default Chat