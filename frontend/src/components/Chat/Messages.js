import React, {useState} from 'react'
import {Box} from '@material-ui/core'

import Message from './Message'
import Spinner from '../Spinner/Spinner'

const Messages = ({messages, loadingMessages, onLoadMore}) => {
  const [activeMessageId, setActiveMessageId] = useState(null)

  const handleInfiniteScroll = ({currentTarget}) => {
    const offset = 20
    if (-currentTarget.scrollTop + currentTarget.clientHeight >= currentTarget.scrollHeight - offset
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
      {messages.map((message, i) =>
        <Message
          active={message._id === activeMessageId}
          key={`${loadingMessages}${i}`}
          message={message}
          setActiveId={setActiveMessageId}
        />
      )}
      {loadingMessages && <Box height={50}><Spinner/></Box>}
    </Box>
  </Box>
}

export default Messages