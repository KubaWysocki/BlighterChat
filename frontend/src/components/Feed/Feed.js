import React, {useState, useContext, Fragment, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {Box, List, ListItem, ListItemAvatar, Avatar, Typography, Badge, Divider} from '@material-ui/core'

import * as api from '../../util/api'
import * as urls from '../../util/urls'
import UserContext from '../../contexts/UserContext'
import NotificationsContext from '../../contexts/NotificationsContext'
import LoadMore from '../LoadMore/LoadMore'
import useLoadMore from '../../Hooks/useLoadMore'
import ScrollContainer from '../Generic/ScrollContainer'
import {CreateChatIcon} from '../Icons/Icons'
import socket from '../../util/socket'

const Feed = ({activeChatSlugRef}) => {
  const [user] = useContext(UserContext)
  const [notifications] = useContext(NotificationsContext)
  const history = useHistory()
  const [feed, setFeed] = useState([])

  const [loading, handleLoadMoreFeed] = useLoadMore(api.FEED, setFeed)

  const handleClick = (slug, name) => {
    history.push(`${urls.CHAT}/${slug}`, {name})
  }

  useEffect(() => {
    const chatMessageCallback = (chat) => {
      if (activeChatSlugRef.current !== chat.slug) return
      setFeed((feed) =>
        feed.map((c) =>
          chat.slug === c.slug
            ? {...chat, messages: [{...chat.messages[0], readList: [user]}]}
            : c
        )
      )
    }
    socket.init().on('chat-message', chatMessageCallback)
    return () => socket.init().off('chat-message', chatMessageCallback)
  }, [activeChatSlugRef, user])

  useEffect(() => {
    if (!loading) {
      setFeed(feed => {
        const notificationWithoutChat = Object.keys(notifications).find(chatSlug =>
          !feed.some(chat => chat.slug === chatSlug)
        )
        if (notificationWithoutChat) {
          return [
            notifications[notificationWithoutChat],
            ...feed
          ]
        }
        else {
          return feed
            .map(chat => notifications[chat.slug] ? notifications[chat.slug] : chat)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        }
      })
    }
  }, [notifications, loading])

  return <ScrollContainer height={1} width={1}>
    <Box component={List} height={1}>
      {feed.map(chat => {
        let chatName
        if(chat.users.length !== 2) chatName = chat.name
        else chatName = chat.users.find(u => u.slug !== user.slug).username

        let notify = notifications[chat.slug]?.messages
        let wasRead = chat.messages[0].user?.slug === user.slug
          || (!notify && chat.messages[0].readList.some(u => u.slug === user.slug))


        let lastMessage = notify && notify[0]?.content
          ? notify[0]
          : chat.messages[0]

        return <Fragment key={chat.slug}>
          <Box
            button
            component={ListItem}
            onClick={() => handleClick(chat.slug, chatName)}>
            <ListItemAvatar>
              <Box component={Avatar} height={40} width={40}>{chatName[0]}</Box>
            </ListItemAvatar>
            <Box width={0.85}>
              <Typography variant='subtitle1'>{chatName}</Typography>
              <Typography display='block' variant={wasRead ? 'caption' : 'subtitle2'} noWrap>
                {lastMessage.user && lastMessage.content}
              </Typography>
            </Box>
            <Box ml='auto'>
              <Badge badgeContent={notify?.length} color='secondary'/>
            </Box>
          </Box>
          <Divider light variant='middle'/>
        </Fragment>
      })}
      <LoadMore loading={loading} onLoadMore={handleLoadMoreFeed}/>
      <CreateChatIcon/>
    </Box>
  </ScrollContainer>
}

export default Feed