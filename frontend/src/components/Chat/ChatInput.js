import React, {useRef, useState} from 'react'
import {Box, InputAdornment, TextField, Paper, Typography} from '@material-ui/core'
import {CreateOutlined, SendRounded, Block} from '@material-ui/icons'

import axios from '../../util/axios'
import * as api from '../../util/api'

const ChatInput = ({chat, receiver, onSetChat}) => {
  const inputRef = useRef()
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = () => {
    if (!message || isSending) return
    setIsSending(true)

    if (chat === true) {
      axios.put(api.CREATE_CHAT, {
        slugs: [receiver],
        content: message,
      })
        .then(res => {
          onSetChat(res.data)
          setMessage('')
          setIsSending(false)
        })
    }
    else {
      axios.post(api.SEND_MESSAGE, {
        chatSlug: chat.slug,
        content: message
      })
        .then(() => {
          setMessage('')
          setIsSending(false)
        })
        .catch(err => {
          if (err.response.status === 409) onSetChat({...chat, blocked: true}, false)
        })
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
    {chat.blocked
      ? <Typography component={Box} p={1} width={1} align="center">
        Chat is blocked <Block fontSize="inherit"/>
      </Typography>
      : <>
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder='Start typing a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') handleSendMessage()
          }}
          InputProps={{
            startAdornment:
              <InputAdornment position="start">
                <CreateOutlined/>
              </InputAdornment>,
            endAdornment: <Box pl={1} onClick={handleSendMessage}>
              <SendRounded color={message.length && !isSending ? 'primary' : 'disabled'} fontSize='large'/>
            </Box>
          }}
        />
      </>
    }
  </Box>
}

export default ChatInput