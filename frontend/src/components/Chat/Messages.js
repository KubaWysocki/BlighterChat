import {Box, Chip, Avatar} from '@material-ui/core'

const Messages = ({messages}) => {
  return <Box
    width={1}
    height={1}
    py={6}
    display='flex'
    flexDirection='column-reverse'
    overflow='scroll'>
    {messages?.map(msg =>
      <Box
        m={1}
        maxWidth='max-content'
        component={Chip}
        color="primary"
        label={msg.content}
        avatar={<Avatar>{msg.user.username[0]}</Avatar>}
      />
    )}
  </Box>
}

export default Messages