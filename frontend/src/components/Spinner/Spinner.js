import {Box, CircularProgress} from '@material-ui/core'


const Spinner = () =>
  <Box display='flex' justifyContent='center' alignItems='center' height={1}>
    <CircularProgress size={30}/>
  </Box>

export default Spinner