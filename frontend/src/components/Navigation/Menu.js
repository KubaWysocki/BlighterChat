import {useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Avatar, Box, Menu, MenuItem} from '@material-ui/core'
import {AccountBox, Group, ExitToApp} from '@material-ui/icons'

import * as urls from '../../util/urls'

import UserContext from '../../util/UserContext'
import axios from '../../util/axios'

const AppMenu = (props) => {
  const [user, setUser] = useContext(UserContext)
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleCloseMenu = () => setAnchorEl(null)

  const handleProfile = () => {
    history.push(`${urls.PROFILE + user.username}/${user.id}`)
    handleCloseMenu()
  }

  const handleFriends = () => {
    history.push(urls.FRIENDS)
    handleCloseMenu()
  }

  const handleLogout = () => {
    localStorage.setItem('token', 'loggedOut')
    setUser({})
    Object.assign(axios.defaults, {
      headers: {
        authorization: null
      }
    })
    history.push(urls.UNAUTHENTICATED)
  }

  return <Box ml={1.5}>
    <Avatar src={null}
      onClick={(e) => setAnchorEl(e.currentTarget)}>
      {user.username[0]}
    </Avatar>
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}>
      <MenuItem dense onClick={handleProfile}>
        <AccountBox/>&nbsp; Profile
      </MenuItem>
      <MenuItem dense onClick={handleFriends}>
        <Group/>&nbsp; Friends
      </MenuItem>
      <MenuItem dense onClick={handleLogout}>
        <ExitToApp/>&nbsp; Logout
      </MenuItem>
    </Menu>
  </Box>
}

export default AppMenu