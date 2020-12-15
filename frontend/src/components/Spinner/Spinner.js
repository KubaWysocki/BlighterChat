import {Box, CircularProgress} from '@material-ui/core'


const Spinner = () =>
  <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
    <CircularProgress size={30}/>
  </Box>

export default Spinner