import {useContext} from 'react'
import {Box, Chip, Avatar, Typography} from '@material-ui/core'

import UserContext from '../../contexts/UserContext'

const MessageInfoText = ({children, width}) =>
  <Box component={Typography} width={width} px={2} variant='caption' align='center' color='gray'>
    {children}
  </Box>


const Message = ({message, active, setActiveId}) => {
  const [user] = useContext(UserContext)

  const time = active
    && <MessageInfoText width={1}>{
      new Date(message.timestamp).toLocaleString(undefined, {dateStyle: 'short', timeStyle: 'short'})
    }</MessageInfoText>

  const sender = active && message.user && message.user.slug !== user.slug
    && <MessageInfoText>{message.user.username}</MessageInfoText>

  const readListText = message.readList
    .filter(u => u.slug !== user.slug)
    .map(u => u.username)
    .join(', ')

  const readList = active && !!readListText.length
    && <MessageInfoText>Seen by: {readListText}</MessageInfoText>

  return <Box
    display='flex'
    flexDirection='column'
    alignItems={message.user
      ? user.slug === message.user.slug ? 'flex-end' : 'flex-start'
      : 'center'
    }
  >
    {time}
    {sender}
    <Box
      onClick={() => active ? setActiveId(null) : setActiveId(message._id)}
      m={0.75}
      component={Chip}
      variant={message.user ? 'default' : 'outlined'}
      label={
        <Box p={1}>{message.content}</Box>
      }
      avatar={!message.user || user.slug === message.user.slug
        ? null
        : <Avatar>{message.user.username[0]}</Avatar>
      }
    />
    {readList}
  </Box>
}

export default Message