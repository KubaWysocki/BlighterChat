import {useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {Avatar, Badge, Box, Menu, MenuItem} from '@material-ui/core'
import {AccountBox, Group, ExitToApp} from '@material-ui/icons'

import axios from '../../util/axios'
import socket from '../../util/socket'
import * as api from '../../util/api'
import * as urls from '../../util/urls'
import {LOGGED_OUT} from '../../util/constants'
import UserContext from '../../contexts/UserContext'

const AppMenu = ({onClear}) => {
  const [user, setUser] = useContext(UserContext)
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(null)
  const [friendRequestsNum, setFriendRequestsNum] = useState(0)

  useEffect(() => {
    axios.get(api.FRIEND_REQUESTS_NUMBER)
      .then(res => {
        setFriendRequestsNum(res.data.friendRequests)
        socket.get().on('friend-request', data => {
          setFriendRequestsNum(data.friendRequests)
        })
      })
  }, [])

  const handleOpenMenu = (e) => {
    onClear()
    setAnchorEl(e.currentTarget)
  }

  const handleCloseMenu = () => setAnchorEl(null)

  const handleProfile = () => {
    history.push(urls.PROFILE + user.slug)
    handleCloseMenu()
  }

  const handleFriends = () => {
    history.push(urls.FRIENDS)
    handleCloseMenu()
  }

  const handleLogout = () => {
    localStorage.setItem('token', LOGGED_OUT)
    setUser(null)
    Object.assign(axios.defaults, {
      headers: {
        authorization: null
      }
    })
    history.push(urls.UNAUTHENTICATED)
  }

  return <Box ml={1.5}>
    <Badge
      invisible={!!anchorEl || friendRequestsNum === 0}
      badgeContent={friendRequestsNum}
      color='secondary'
      overlap='circle'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}>
      <Avatar
        src={null}
        onClick={handleOpenMenu}>
        {user.username[0]}
      </Avatar>
    </Badge>
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
      <MenuItem onClick={handleProfile}>
        <AccountBox/>&nbsp; Profile
      </MenuItem>
      <MenuItem onClick={handleFriends}>
        <Badge
          badgeContent={friendRequestsNum}
          color='secondary'
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}>
          <Group/>
        </Badge>
        &nbsp; Friends
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ExitToApp/>&nbsp; Logout
      </MenuItem>
    </Menu>
  </Box>
}

export default AppMenu