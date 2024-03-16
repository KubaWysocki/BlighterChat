import {Box, ListItem, ListItemAvatar, Avatar} from '@material-ui/core'
import {useHistory} from 'react-router-dom'
import React from 'react'

import * as urls from '../../util/urls'


const UserListItem = ({user, onClick, withoutLink, children}) => {
  const history = useHistory()

  const handleClick = () => {
    if (onClick) onClick()
    if (!withoutLink) history.push(urls.PROFILE + user.slug)
  }

  return <Box
    button
    width={1}
    component={ListItem}
    key={user.slug}
    onClick={handleClick}>
    <ListItemAvatar>
      <Box component={Avatar} height={35} width={35}>{user.username[0]}</Box>
    </ListItemAvatar>
    {user.username}
    {children}
  </Box>
}

export default UserListItem