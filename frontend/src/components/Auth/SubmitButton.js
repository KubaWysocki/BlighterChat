import {Box, Button} from '@material-ui/core'


const SubmitButton = () =>
  <Box my={4} display='flex' justifyContent='center'>
    <Button
      type='submit'
      color='primary'
      variant='contained'
    >
      Signup
    </Button>
  </Box>

export default SubmitButton