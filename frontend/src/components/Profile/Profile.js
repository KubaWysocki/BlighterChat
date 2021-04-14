import {useCallback, useContext, useEffect, useRef, useState} from 'react'
import {Avatar, Box, Button, Typography} from '@material-ui/core'
import {Link, useRouteMatch} from 'react-router-dom'
import {Delete, Done, PersonAdd, Send} from '@material-ui/icons'

import * as api from '../../util/api'
import * as urls from '../../util/urls'
import axios from '../../util/axios'
import UserContext from '../../contexts/UserContext'
import Spinner from '../Spinner/Spinner'
import ConfrimationDialog from '../ConfirmationDialog/ConfrimationDialog'


const Profile = () => {
  const {params} = useRouteMatch('/profile/:slug?')

  const [user] = useContext(UserContext)
  const [profile, setProfile] = useState(null)
  const dialogRef = useRef()

  const handleLoadProfile = useCallback(() => {
    setProfile(null)
    axios.get(api.GET_PROFILE + params.slug)
      .then(res => setProfile(res.data))
  }, [params.slug])

  useEffect(() => {
    if (!params.slug) {
      return //redirect to 404 page
    }
    else if (params.slug === user.slug) {
      setProfile(user)
    }
    else {
      handleLoadProfile()
    }
  }, [user, params.slug, handleLoadProfile])

  const handleDeleteFriend = () => {
    axios.delete(api.REMOVE_FRIEND + params.slug)
      .then((res) => {
        setProfile({...profile, ...res.data})
        dialogRef.current.handleClose()
      })
  }

  const handleAddFriend = (e) => {
    axios.put(api.ADD_FRIEND, {slug: params.slug})
      .then(res => setProfile(res.data))
  }

  const handleRejectFriend = () => {
    axios.delete(api.REJECT_FRIEND_REQUEST + params.slug)
      .then(res => {
        setProfile({...profile, ...res.data})
        dialogRef.current.handleClose()
      })
  }

  const handleSendFriendRequest = () => {
    axios.put(api.SEND_FRIEND_REQUEST, {slug: params.slug})
      .then(res => setProfile({...profile, ...res.data}))
      .catch(err => {
        if (err.request?.status === 409) handleLoadProfile()
      })
  }

  let action = null
  if (user === profile) {
    action = <Typography variant='overline'>Your Profile</Typography>
  }
  else if (profile?.isFriend) {
    action = <>
      <Button
        variant='contained'
        color='primary'
        startIcon={<Send/>}
        component={Link}
        to={{
          pathname: urls.CHAT,
          search: `?receiver=${params.slug}`,
          state: {name: profile.username}
        }}
      >Message</Button>
      <Button
        variant='contained'
        color='secondary'
        startIcon={<Delete/>}
        onClick={() => dialogRef.current.handleOpen({
          message: `Delete ${profile.username} from friends?`,
          action: handleDeleteFriend,
        })}
      >Remove</Button>
    </>
  }
  else if (profile?.didUserSendFriendRequest) {
    action = <>
      <Button
        variant='contained'
        color='primary'
        startIcon={<PersonAdd/>}
        onClick={handleAddFriend}
      >Accept Friend</Button>
      <Button
        variant='contained'
        color='secondary'
        startIcon={<Delete/>}
        onClick={() => dialogRef.current.handleOpen({
          message: `Reject friend request from ${profile.username}?`,
          action: handleRejectFriend,
        })}
      >Reject Friend</Button>
    </>
  }
  else if (profile?.isFriendRequestSent) {
    action = <Typography><Done/> Friend request sent</Typography>
  }
  else if (!profile?.isFriendRequestSent) {
    action = <Button
      color='primary'
      variant='contained'
      startIcon={<PersonAdd/>}
      onClick={handleSendFriendRequest}
    >Send Invitation</Button>
  }

  return <Box
    width={1}
    height={1}
    display='flex'
    justifyContent='center'
    alignItems='center'
    flexDirection='column'>
    {!profile
      ? <Spinner/>
      : <>
        <Box component={Avatar} width={100} height={100} fontSize={40}>
          {profile.username[0]}
        </Box>
        <Box
          height={0.4}
          display='flex'
          justifyContent='space-around'
          alignItems='center'
          flexDirection='column'>
          <Typography variant='h3'>{profile.username}</Typography>
          <Typography variant='h5'>{profile.email}</Typography>
          {action}
        </Box>
        <ConfrimationDialog ref={dialogRef}/>
      </>
    }
  </Box>
}

export default Profile