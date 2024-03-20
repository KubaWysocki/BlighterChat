import React from 'react'
import {Link} from 'react-router-dom'
import {Box, Paper, IconButton, Typography, Badge, useMediaQuery} from '@material-ui/core'
import {ArrowBackRounded, Settings} from '@material-ui/icons'

import * as urls from '../../util/urls'

const ChatTopBar = ({name, otherChatsNotif}) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('xs'))

  return <Box
    component={Paper}
    square
    width={1}
    position='absolute'
    display='flex'
    alignItems='center'
    justifyContent='space-between'
  >
    <IconButton component={Link} to={urls.FEED}>
      <Badge
        badgeContent={isSmallScreen && otherChatsNotif ? otherChatsNotif : 0}
        color='secondary'
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <ArrowBackRounded/>
      </Badge>
    </IconButton>
    <Typography variant='h6'>{name}</Typography>
    <IconButton>
      <Settings/>
    </IconButton>
  </Box>
}

export default ChatTopBar