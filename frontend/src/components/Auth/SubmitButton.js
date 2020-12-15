import {Box, Button} from '@material-ui/core'


const SubmitButton = ({isSignup}) =>
  <Box my={4} display='flex' justifyContent='center'>
    <Button
      type='submit'
      color='primary'
      variant='contained'
    >
      {isSignup ? 'Signup' : 'Login'}
    </Button>
  </Box>

export default SubmitButton