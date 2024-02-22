import {Box, IconButton} from '@material-ui/core'


const UserListItemActions = ({actions, onClick}) =>
  <Box ml='auto' onClick={(e) => {
    e.stopPropagation()
    onClick && onClick()
  }}>
    {actions.map((action, i) =>
      <IconButton
        key={i}
        onClick={() => action.onClick()}>
        {action.icon}
      </IconButton>
    )}
  </Box>

export default UserListItemActions