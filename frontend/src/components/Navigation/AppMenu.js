import {useContext, useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {Avatar, Badge, Box, Menu, MenuItem} from '@material-ui/core'
import {AccountBox, Group, ExitToApp} from '@material-ui/icons'

import axios from '../../util/axios'
import socket from '../../util/socket'
import * as api from '../../util/api'
import * as urls from '../../util/urls'
import {LS_TOKEN} from '../../util/constants'
import UserContext from '../../contexts/UserContext'
import NotificationsContext from '../../contexts/NotificationsContext'
import FriendRequestsNumberContext from '../../contexts/FriendRequestsNumberContext'

const AppMenu = ({onClear}) => {
  const [user, setUser] = useContext(UserContext)
  const setNotifications = useContext(NotificationsContext)[1]
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(null)
  const [friendRequestsNum, setFriendRequestsNum] = useContext(FriendRequestsNumberContext)

  useEffect(() => {
    const newFriendRequest = () => {
      if (history.location.pathname !== urls.FRIENDS) {
        setFriendRequestsNum(num => num + 1)
      }
    }

    axios.get(api.NEW_FRIEND_REQUESTS_NUMBER)
      .then(res => {
        setFriendRequestsNum(res.data.friendRequests)
        socket.get().on('friend-request', newFriendRequest)
      })

    return () => socket.get().off('friend-request', newFriendRequest)
  }, [history, setFriendRequestsNum])

  const handleOpenMenu = (e) => {
    onClear()
    setAnchorEl(e.currentTarget)
  }

  const handleCloseMenu = () => setAnchorEl(null)

  const handleLogout = () => {
    axios.post(api.LOGOUT)
      .then(() => {
        socket.get().close()
        localStorage.setItem(LS_TOKEN.KEY, LS_TOKEN.LOGGED_OUT)
        history.push(urls.UNAUTHENTICATED)
        setUser(null)
        setNotifications([])
      })
  }

  return <Box ml={1.5}>
    <Badge
      invisible={!!anchorEl || friendRequestsNum === 0}
      badgeContent={friendRequestsNum}
      color='secondary'
      overlap='circular'
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
      <MenuItem
        component={Link}
        to={urls.PROFILE + user.slug}
        onClick={handleCloseMenu}>
        <AccountBox/>&nbsp; Profile
      </MenuItem>
      <MenuItem
        component={Link}
        to={urls.FRIENDS}
        onClick={handleCloseMenu}>
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