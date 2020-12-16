import {useContext, useEffect, useState} from 'react'
import {Avatar, Box, Button, Typography} from '@material-ui/core'
import {useRouteMatch} from 'react-router-dom'
import {Done} from '@material-ui/icons'

import * as api from '../../util/api'
import axios from '../../util/axios'
import UserContext from '../../util/UserContext'
import Spinner from '../Spinner/Spinner'
import socket from '../../util/socket'

const Profile = () => {
  const [user] = useContext(UserContext)
  const [profile, setProfile] = useState(null)
  const {params} = useRouteMatch('/profile/:slug?')

  useEffect(() => {
    if (!params.slug) {
      return
    }
    else if (params.slug === user.slug) {
      setProfile(user)
    }
    else {
      axios.get(api.GET_PROFILE + params.slug)
        .then(res => setProfile(res.data))
        .catch(err => {
          console.log({...err}) //404
        })
    }
  }, [user, params.slug])

  const handleAddFriend = () => {

  }

  const handleSendFriendRequest = () => {
    axios.put(api.SEND_FRIEND_REQUEST, {_id: profile._id})
      .then(res => {
        setProfile({...profile, ...res.data})
      })
  }

  let action = null
  if (user === profile) {
    action = <Typography variant='overline'>Your Profile</Typography>
  }
  else if (profile?.isFriend) {
    action = <Button>Message</Button>
  }
  else if (profile?.didUserSendFriendRequest) {
    action = <Button onClick={handleAddFriend}>Accept Friend</Button>
  }
  else if (!profile?.isFriendRequestSent) {
    action = <Button onClick={handleSendFriendRequest}>Add to friends</Button>
  }
  else if (profile.isFriendRequestSent) {
    action = <Typography><Done/>Friend request sent</Typography>
  }

  return <Box
    width={1}
    height={1}
    display='flex'
    justifyContent='center'
    alignItems='center'
    flexDirection='column'
  >
    {!profile
      ? <Spinner/>
      : <>
        <Box component={Avatar} width={100} height={100} fontSize={40}>
          {profile.username[0]}
        </Box>
        <Typography variant='h3'>{profile.username}</Typography>
        <Typography variant='h5'>{profile.email}</Typography>
        {action}
      </>
    }
  </Box>
}

export default Profile