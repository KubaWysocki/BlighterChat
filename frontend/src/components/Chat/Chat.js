import {useEffect, useState, useCallback, useMemo, useContext} from 'react'
import {useHistory, useLocation, useRouteMatch} from 'react-router-dom'

import axios from '../../util/axios'
import socket from '../../util/socket'
import * as api from '../../util/api'
import * as urls from '../../util/urls'
import UserContext from '../../contexts/UserContext'
import NotificationsContext from '../../contexts/NotificationsContext'
import ChatInput from './ChatInput'
import Messages from './Messages'
import ChatTopBar from './ChatTopBar'
import Spinner from '../Spinner/Spinner'
import useLoadMore from '../../Hooks/useLoadMore'

const Chat = ({activeChatRef, onSetActiveChat}) => {
  const [user] = useContext(UserContext)
  const [notifications, setNotifications] = useContext(NotificationsContext)
  const history = useHistory()
  const {params} = useRouteMatch('/chat/:slug?')
  const {search, state: routeState} = useLocation()
  const [chat, setChat] = useState(null)
  const [messages, setMessages] = useState([])

  const receiver = search.split('=')[1]

  const [loadingMessages, handleLoadMoreMessages] = useLoadMore(`${api.MORE_MESSAGES}/${params.slug}`, setMessages, 1)

  const chatMessageCallback = useCallback(chat => {
    if (activeChatRef.current !== chat.slug) return //oposite case handled in /src/App.js
    const newMessage = chat.messages[0]
    setMessages(messages => [newMessage, ...messages])
    if (newMessage.user.slug !== user.slug) {
      axios.post(api.MESSAGE_READ, {_id: newMessage._id})
    }
  }, [activeChatRef, user.slug])

  const handleSetChat = useCallback((chat, withMessages=true) => {
    setNotifications(notifications => {
      const newNotifications = {...notifications}
      delete newNotifications[chat.slug]
      return newNotifications
    })
    const {messages, ...info} = chat
    setChat(info)
    if (withMessages) setMessages(messages)
    onSetActiveChat(info.slug)

    socket.get().on('chat-message', chatMessageCallback)

    history.replace(`${urls.CHAT}/${chat.slug}`)
  }, [history, setNotifications, onSetActiveChat, chatMessageCallback])

  useEffect(() => {
    if (!chat) {
      axios.get(`${api.GET_CHAT}${params.slug || ''}${search || ''}`)
        .then(res => {
          if (res.data.newChat) return setChat(true)

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
    if (routeState?.name) return routeState.name
    else if (chat) {
      if (chat.users.length > 2) return chat.name
      else return chat.users.find(u => u.username !== user.username).username
    }
    else return receiver
  }, [chat, receiver, routeState?.name, user.username])

  return <>
    <ChatTopBar name={topBarName} otherChatsNotif={chat && Object.keys(notifications).length}/>
    {chat
      ? <>
        <Messages messages={messages} loadingMessages={loadingMessages} onLoadMore={handleLoadMoreMessages}/>
        <ChatInput chat={chat} receiver={receiver} onSetChat={handleSetChat}/>
      </>
      : <Spinner/>
    }
  </>
}

export default Chat