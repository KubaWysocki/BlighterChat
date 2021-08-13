import {useContext} from 'react'
import {Box, Chip, Avatar} from '@material-ui/core'

import UserContext from '../../contexts/UserContext'

const Message = ({message}) => {
  const [user] = useContext(UserContext)

  return <Box
    m={1}
    maxWidth='max-content'
    component={Chip}
    variant={message.user ? 'default' : 'outlined'}
    alignSelf={
      message.user
        ? user.slug === message.user.slug ? 'flex-end' : 'flex-start'
        : 'center'
    }
    label={<Box p={1}>{message.content}</Box>}
    avatar={!message.user || user.slug === message.user.slug
      ? null
      : <Avatar>{message.user.username[0]}</Avatar>
    }
  />
}

export default Message