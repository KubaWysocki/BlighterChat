import {useEffect, useState} from 'react'
import {Box, List, ListSubheader, Typography, IconButton, Divider} from '@material-ui/core'
import {Delete, Done, Clear, Send} from '@material-ui/icons'

import axios from '../../util/axios'
import * as api from '../../util/api'
import UserListItem from '../UserListItem/UserListItem'
import Spinner from '../Spinner/Spinner'

const FriendListItem = ({user, positiveIcon, handlePositive, negativeIcon, handleNegative}) =>
  <UserListItem user={user} key={user.slug}>
    <Box ml='auto'>
      <IconButton onClick={e => {
        e.stopPropagation()
        handlePositive(user.slug)
      }}>
        {positiveIcon}
      </IconButton>
      <IconButton onClick={e => {
        e.stopPropagation()
        handleNegative(user.slug)
      }}>
        {negativeIcon}
      </IconButton>
    </Box>
  </UserListItem>

const Friends = () => {
  const [friendRequests, setFriendRequests] = useState(null)
  const [friends, setFriends] = useState(null)

  useEffect(() => {
    axios.get(api.FRIEND_REQUESTS)
      .then(res => setFriendRequests(res.data))

    axios.get(api.FRIENDS)
      .then(res => setFriends(res.data))
  }, [])

  const handleAcceptRequest = (slug) => {
    axios.put(api.ADD_FRIEND, {slug})
      .then(res => {
        setFriendRequests(
          friendRequests.filter(fr => fr.slug !== res.data.slug)
        )
        setFriends(
          [res.data, ...friends]
        )
      })
  }

  const handleDeleteRequest = (slug) => {
    axios.delete(api.REJECT_FRIEND_REQUEST + slug)
      .then(res => {
        setFriendRequests(
          friendRequests.filter(fr => fr.slug !== res.data.slug)
        )
      })
  }

  const handleSendMessage = (e) => {

  }

  const handleDeleteFriend = (slug) => {
    axios.delete(api.REMOVE_FRIEND + slug)
      .then(res => {
        setFriends(
          friends.filter(f => f.slug !== res.data.slug)
        )
      })
  }

  return <Box pt={7}>
    <List>
      <ListSubheader>
        <Box
          align='center'
          component={Typography}
          variant='h5'>Friend Invitations</Box>
        <Divider/>
        {friendRequests === null
          ? <Spinner/>
          : friendRequests.length
            ? friendRequests.map(user =>
              <FriendListItem
                key={user.slug}
                user={user}
                positiveIcon={<Done color='primary'/>}
                handlePositive={handleAcceptRequest}
                negativeIcon={<Clear color='secondary'/>}
                handleNegative={handleDeleteRequest}/>
            )
            : <Box component={Typography} align='center' p={2}>Nothing here :(</Box>
        }
        <Divider/>
      </ListSubheader>
      <ListSubheader>
        <Box
          pt={4}
          align='center'
          component={Typography}
          variant='h5'>Friends</Box>
        <Divider/>
        {friends === null
          ? <Spinner/>
          : friends.length
            ? friends.map(user =>
              <FriendListItem
                key={user.slug}
                user={user}
                positiveIcon={<Send color='primary'/>}
                handlePositive={handleSendMessage}
                negativeIcon={<Delete color='disabled'/>}
                handleNegative={handleDeleteFriend}/>
            )
            : <Box component={Typography} align='center' p={2}>Nothing here :(</Box>
        }
        <Divider/>
      </ListSubheader>
    </List>
  </Box>
}

export default Friends