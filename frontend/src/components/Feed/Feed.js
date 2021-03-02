import {useState, useContext, Fragment} from 'react'
import {useHistory} from 'react-router-dom'
import {Box, List, ListItem, ListItemAvatar, Avatar, Typography, Badge, Divider} from '@material-ui/core'

import * as api from '../../util/api'
import * as urls from '../../util/urls'
import UserContext from '../../contexts/UserContext'
import NotificationsContext from '../../contexts/NotificationsContext'
import LoadMore from '../LoadMore/LoadMore'
import useLoadMore from '../../Hooks/useLoadMore'

const Feed = () => {
  const [user] = useContext(UserContext)
  const [notifications] = useContext(NotificationsContext)
  const history = useHistory()
  const [feed, setFeed] = useState([])

  const [loading, handleLoadMoreFeed] = useLoadMore(api.FEED, setFeed)

  const handleClick = (slug, name) => {
    history.push(`${urls.CHAT}/${slug}`, {name})
  }

  return <Box
    mt={6}>
    <List>
      {feed.map(chat => {
        let chatName
        if(chat.users.length !== 2) chatName = chat.name
        else chatName = chat.users.find(u => u.username !== user.username).username

        let notify = notifications[chat.slug]
        let wasRead = !notify && chat.messages[0].readList.some(u => u.username === user.username)

        let lastMessage = notify && notify[notify.length - 1]?.content
          ? notify[notify.length - 1].content
          : chat.messages[0].content

        return <Fragment key={chat.slug}>
          <Box
            button
            component={ListItem}
            onClick={() => handleClick(chat.slug, chatName)}>
            <ListItemAvatar>
              <Box component={Avatar} height={40} width={40}>{chatName[0]}</Box>
            </ListItemAvatar>
            <Box>
              <Typography variant='subtitle1'>{chatName}</Typography>
              <Typography variant={wasRead ? 'caption' : 'subtitle2'}>{lastMessage}</Typography>
            </Box>
            <Box ml='auto'>
              <Badge badgeContent={notify?.length} color='secondary'/>
            </Box>
          </Box>
          <Divider light variant='middle'/>
        </Fragment>
      })}
      <LoadMore loading={loading} onLoadMore={handleLoadMoreFeed}/>
    </List>
  </Box>
}

export default Feed