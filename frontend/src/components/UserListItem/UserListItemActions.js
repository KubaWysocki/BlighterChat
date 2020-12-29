import {Box, IconButton} from '@material-ui/core'


const UserListItemActions = ({actions}) =>
  <Box ml='auto'>
    {actions.map(action =>
      <IconButton
        key={action.icon.type.displayName}
        onClick={e => {
          e.stopPropagation()
          action.onClick()
        }}>
        {action.icon}
      </IconButton>
    )}
  </Box>

export default UserListItemActions