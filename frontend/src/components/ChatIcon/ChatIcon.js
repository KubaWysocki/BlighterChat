import {Link} from 'react-router-dom'
import {Avatar, Box, Badge} from '@material-ui/core'
import {QuestionAnswerRounded} from '@material-ui/icons'

import * as urls from '../../util/urls'

const ChatIcon = ({notifications}) => {
  return <Link to={urls.FEED}>
    <Box p={2.5}
      position='absolute'
      bottom={0}
      right={0}>
      <Badge
        badgeContent={notifications}
        color='secondary'
        overlap='circle'>
        <Box p={3}
          component={Avatar}>
          <QuestionAnswerRounded fontSize='large'/>
        </Box>
      </Badge>
    </Box>
  </Link>
}

export default ChatIcon