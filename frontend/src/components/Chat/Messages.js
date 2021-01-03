import {useContext} from 'react'
import {Box, Chip, Avatar} from '@material-ui/core'

import UserContext from '../../contexts/UserContext'

const Messages = ({messages}) => {
  const [user] = useContext(UserContext)

  return <Box
    width={1}
    height={1}
    py={6}
    display='flex'
    flexDirection='column-reverse'
    overflow='scroll'>
    {messages?.map((msg, i) =>
      <Box
        key={i}
        m={1}
        maxWidth='max-content'
        component={Chip}
        alignSelf={user.slug === msg.user.slug ? 'flex-end' : 'flex-start'}
        label={<Box p={1}>{msg.content}</Box>}
        avatar={user.slug === msg.user.slug ? null : <Avatar>{msg.user.username[0]}</Avatar>}
      />
    )}
  </Box>
}

export default Messages