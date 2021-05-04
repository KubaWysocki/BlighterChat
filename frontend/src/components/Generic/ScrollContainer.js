import {Box} from '@material-ui/core'

const ScrollContainer = (props) =>
  <Box
    mt={6}
    overflow='auto'
    maxHeight='calc(100% - 48px)'
    {...props}
  />

export default ScrollContainer