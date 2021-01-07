import {useHistory} from 'react-router-dom'
import {Box, Paper, IconButton, Typography, Badge} from '@material-ui/core'
import {ArrowBackRounded, Settings} from '@material-ui/icons'

import * as urls from '../../util/urls'

const ChatTopBar = ({name, otherChatsNotif}) => {
  const history = useHistory()

  return <Box
    component={Paper}
    square
    width={1}
    position='absolute'
    display='flex'
    alignItems='center'
    justifyContent='space-between'
    zIndex='tooltip'>
    <IconButton onClick={() => history.push(urls.FEED)}>
      <Badge
        badgeContent={otherChatsNotif}
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