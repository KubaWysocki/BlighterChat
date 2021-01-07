import {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Box, List, ListSubheader, Typography, Divider} from '@material-ui/core'
import {Delete, Done, Clear, Send} from '@material-ui/icons'

import axios from '../../util/axios'
import * as api from '../../util/api'
import * as urls from '../../util/urls'
import Spinner from '../Spinner/Spinner'
import UserListItem from '../UserListItem/UserListItem'
import UserListItemActions from '../UserListItem/UserListItemActions'


const Friends = () => {
  const history = useHistory()
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

  const handleSendMessage = ({slug, username}) => {
    history.push(`${urls.CHAT}?receiver=${slug}`, {username: username})
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
              <UserListItem key={user.slug} user={user}>
                <UserListItemActions
                  actions={[
                    {
                      icon: <Done color='primary'/>,
                      onClick: () => handleAcceptRequest(user.slug)
                    },
                    {
                      icon: <Clear color='secondary'/>,
                      onClick: () => handleDeleteRequest(user.slug)
                    }
                  ]}
                />
              </UserListItem>
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
              <UserListItem key={user.slug} user={user}>
                <UserListItemActions
                  actions={[
                    {
                      icon: <Send color='primary'/>,
                      onClick: () => handleSendMessage(user),
                    },
                    {
                      icon: <Delete color='disabled'/>,
                      onClick: () => handleDeleteFriend(user.slug),
                    }
                  ]}
                />
              </UserListItem>
            )
            : <Box component={Typography} align='center' p={2}>Nothing here :(</Box>
        }
        <Divider/>
      </ListSubheader>
    </List>
  </Box>
}

export default Friends