import React from 'react'
import {Box, Button} from '@material-ui/core'


const SubmitButton = ({text}) =>
  <Box my={4} display='flex' justifyContent='center'>
    <Button
      type='submit'
      color='primary'
      variant='contained'
    >
      {text}
    </Button>
  </Box>

export default SubmitButton