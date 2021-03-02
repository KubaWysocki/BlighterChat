import {Box, IconButton} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Spinner from '../Spinner/Spinner'

const LoadMore = ({loading, onLoadMore, empty}) => {
  let action
  if (loading === null) {
    action = empty
  }
  else if (loading === false) {
    action = <IconButton onClick={onLoadMore}>
      <ExpandMoreIcon fontSize='large'/>
    </IconButton>
  }
  else if (loading === true) {
    action = <Box p={1}>
      <Spinner/>
    </Box>
  }
  return <Box display='flex' justifyContent='center'>
    {action}
  </Box>
}

export default LoadMore