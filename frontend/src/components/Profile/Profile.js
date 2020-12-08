import {useContext, useEffect, useState} from 'react'
import {Avatar, Box, Button, CircularProgress, Typography} from '@material-ui/core'
import {useRouteMatch} from 'react-router-dom'

import axios from '../../util/axios'
import UserContext from '../../util/UserContext'

import * as api from '../../util/api'

const Profile = (props) => {
  const [user] = useContext(UserContext)
  const [profile, setProfile] = useState(null)
  const {params} = useRouteMatch('/profile/:username')

  useEffect(() => {
    if (params.username !== user.username) {
      axios.get(`${api.GET_USER}/${params.username}`)
        .then(res => setProfile(res.data))
        .catch(err => {
          console.log({...err})
        })
    }
    else setProfile(user)
  }, [user, params.username])

  return <Box
    width={1}
    height={1}
    display='flex'
    justifyContent='center'
    alignItems='center'
    flexDirection='column'
  >
    {!profile
      ? <CircularProgress/>
      : <>
        <Avatar src={profile.images?.[0]}>{profile.username?.[0]}</Avatar>
        <Typography variant='h3'>{profile.username}</Typography>
        <Typography variant='h5'>{profile.email}</Typography>
        {user === profile &&
          <Button>Edit</Button>
        }
      </>
    }
  </Box>
}

export default Profile