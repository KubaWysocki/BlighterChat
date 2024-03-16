import {Link} from 'react-router-dom'
import {Avatar, Box, Badge} from '@material-ui/core'
import {QuestionAnswerRounded, Add} from '@material-ui/icons'
import React from 'react'

import * as urls from '../../util/urls'

export const BottomRightCorner = ({to, children}) =>
  <Link to={to}>
    <Box p={2.5}
      position='absolute'
      bottom={0}
      right={0}
      zIndex='snackbar'>
      {children}
    </Box>
  </Link>

export const ChatIcon = ({notificationsNumber}) =>
  <BottomRightCorner to={urls.FEED}>
    <Badge
      color='secondary'
      badgeContent={notificationsNumber}
      overlap='circular'>
      <Box p={3} component={Avatar}>
        <QuestionAnswerRounded fontSize='large'/>
      </Box>
    </Badge>
  </BottomRightCorner>

export const CreateChatIcon = () =>
  <BottomRightCorner to={urls.NEW_CHAT}>
    <Box p={3} component={Avatar}>
      <Add fontSize='large'/>
    </Box>
  </BottomRightCorner>