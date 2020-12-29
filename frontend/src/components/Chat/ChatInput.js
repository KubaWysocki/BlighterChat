import {useState} from 'react'
import {Box, InputAdornment, TextField, Paper} from '@material-ui/core'
import {CreateOutlined, SendRounded} from '@material-ui/icons'

import axios from '../../util/axios'
import * as api from '../../util/api'

const ChatInput = ({chat, receiver, onSetChat}) => {
  const [message, setMessage] = useState('')

  const handleSendMessage = () => {
    if (!message) return

    if (!chat) {
      axios.put(api.CREATE_CHAT, {
        slugs: [receiver],
        content: message,
      })
        .then(res => {
          onSetChat(res.data)
          setMessage('')
        })
    }
    else {
      axios.post(api.SEND_MESSAGE, {
        chatSlug: chat.slug,
        content: message
      })
        .then(res => setMessage(''))
    }
  }

  return <Box
    component={Paper}
    variant='outlined'
    square
    width={1}
    position='absolute'
    display='flex'
    bottom={0}
    px={1}
    pt={1}>
    <TextField
      fullWidth
      placeholder='Start typing a message'
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      InputProps={{
        startAdornment:
        <InputAdornment position="start">
          <CreateOutlined/>
        </InputAdornment>,
      }}
    />
    <Box pl={1} onClick={handleSendMessage}>
      <SendRounded color={message.length ? 'primary' : 'disabled'} fontSize='large'/>
    </Box>
  </Box>
}

export default ChatInput