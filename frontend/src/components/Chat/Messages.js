import {useContext} from 'react'
import {Box, Chip, Avatar} from '@material-ui/core'

import UserContext from '../../contexts/UserContext'
import Spinner from '../Spinner/Spinner'

const Messages = ({messages, loadingMessages, onLoadMore}) => {
  const [user] = useContext(UserContext)

  const handleInfiniteScroll = ({target}) => {
    if (-target.scrollTop + target.clientHeight >= target.scrollHeight
      && loadingMessages !== null
      && loadingMessages !== true) {
      onLoadMore()
    }
  }

  return <Box py={6} height={1}>
    <Box
      height={1}
      display='flex'
      flexDirection='column-reverse'
      overflow='auto'
      onScroll={handleInfiniteScroll}>
      {messages.map((msg, i) =>
        <Box
          key={`${loadingMessages}${i}`}
          m={1}
          maxWidth='max-content'
          component={Chip}
          variant={msg.user ? 'default' : 'outlined'}
          alignSelf={
            msg.user
              ? user.slug === msg.user.slug ? 'flex-end' : 'flex-start'
              : 'center'
          }
          label={<Box p={1}>{msg.content}</Box>}
          avatar={!msg.user || user.slug === msg.user.slug ? null : <Avatar>{msg.user.username[0]}</Avatar>}
        />
      )}
      {loadingMessages && <Box height={50}><Spinner/></Box>}
    </Box>
  </Box>
}

export default Messages