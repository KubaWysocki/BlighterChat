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

const Chat = ({activeChatRef, onSetActiveChat}) => {
  const [user] = useContext(UserContext)
  const [notifications, setNotifications] = useContext(NotificationsContext)
  const history = useHistory()
  const {params} = useRouteMatch('/chat/:slug?')
  const {search, state: routeState} = useLocation()
  const [chat, setChat] = useState(null)

  const receiver = search.split('=')[1]

  const chatMessageCallback = useCallback(data => {
    const {chatSlug, message} = data
    if (activeChatRef.current !== chatSlug) return //oposite case handled in /src/App.js

    setChat(chat =>
      Object.assign({}, chat, {messages: [message, ...chat.messages]})
    )
    if (message.user.slug !== user.slug) {
      axios.post(api.MESSAGE_READ, {_id: message._id})
    }
  }, [activeChatRef, user.slug])

  const handleSetChat = useCallback((chat) => {
    setNotifications(notifications => {
      const newNotifications = {...notifications}
      delete newNotifications[chat.slug]
      return newNotifications
    })
    setChat(chat)
    onSetActiveChat(chat.slug)

    socket.get().on('chat-message', chatMessageCallback)

    history.replace(`${urls.CHAT}/${chat.slug}`)
  }, [history, setNotifications, onSetActiveChat, chatMessageCallback])

  useEffect(() => {
    if (!chat) {
      axios.get(`${api.GET_CHAT}${params.slug || 'findOrCreate'}${search || ''}`)
        .then(res => {
          if (res.data.newChat) return

          handleSetChat(res.data)
        })
    }
  }, [chat, search, params.slug, handleSetChat])

  useEffect(() => {
    return () => {
      onSetActiveChat(null)
      socket.get().off('chat-message', chatMessageCallback)
    }
  }, [onSetActiveChat, chatMessageCallback])

  const topBarName = useMemo(() => {
    if (routeState?.username) return routeState.username
    else if (chat) {
      if (chat.users.length > 2) return chat.name
      else return chat.users.find(u => u.username !== user.username).username
    }
    else return receiver
  }, [chat, receiver, routeState?.username, user.username])

  return <>
    <ChatTopBar name={topBarName} otherChatsNotif={chat && Object.keys(notifications).length}/>
    <Messages messages={chat?.messages}/>
    <ChatInput chat={chat} receiver={receiver} onSetChat={handleSetChat}/>
  </>
}

export default Chat