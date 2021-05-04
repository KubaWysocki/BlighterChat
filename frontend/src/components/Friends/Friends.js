import {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Box, List, ListSubheader, Typography, Divider} from '@material-ui/core'
import {Delete, Done, Clear, Send, SentimentVeryDissatisfied} from '@material-ui/icons'

import axios from '../../util/axios'
import * as api from '../../util/api'
import * as urls from '../../util/urls'
import socket from '../../util/socket'
import Spinner from '../Spinner/Spinner'
import UserListItem from '../UserListItem/UserListItem'
import UserListItemActions from '../UserListItem/UserListItemActions'
import LoadMore from '../LoadMore/LoadMore'
import useLoadMore from '../../Hooks/useLoadMore'
import FriendRequestsNumberContext from '../../contexts/FriendRequestsNumberContext'
import Confrim from '../Confirm/Confirm'
import ScrollContainer from '../Generic/ScrollContainer'


const Friends = () => {
  const history = useHistory()
  const [friendRequests, setFriendRequests] = useState(null)
  const [friends, setFriends] = useState([])
  const setFriendRequestsNum = useContext(FriendRequestsNumberContext)[1]
  const dialogRef = useRef()

  const [loading, handleLoadMoreFriends] = useLoadMore(api.FRIENDS, setFriends)

  useEffect(() => {
    const getFriendRequests = () => {
      axios.get(api.FRIEND_REQUESTS)
        .then(res => {
          setFriendRequestsNum(0)
          setFriendRequests(res.data)
        })
    }
    getFriendRequests()

    socket.get().on('friend-request', getFriendRequests)
    return () => socket.get().off('friend-request', getFriendRequests)
  }, [setFriendRequestsNum])

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
        dialogRef.current.handleClose()
      })
  }

  const handleSendMessage = ({slug, username}) => {
    history.push(`${urls.CHAT}?receiver=${slug}`, {name: username})
  }

  const handleDeleteFriend = (slug) => {
    axios.delete(api.REMOVE_FRIEND + slug)
      .then(res => {
        setFriends(
          friends.filter(f => f.slug !== res.data.slug)
        )
        dialogRef.current.handleClose()
      })
  }

  const nothingHere =
    <Box component={Typography} align='center' p={2}>
      Nothing here <SentimentVeryDissatisfied fontSize='small'/>
    </Box>

  return <ScrollContainer>
    <List>
      <ListSubheader>
        <Box
          bgcolor='#282c34'
          align='center'
          component={Typography}
          variant='h5'
        >Friend Invitations</Box>
        <Divider/>
      </ListSubheader>
      {friendRequests === null
        ? <Box p={1}><Spinner/></Box>
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
                    onClick: () => dialogRef.current.handleOpen({
                      message: `Reject friend request from ${user.username}?`,
                      action: () => handleDeleteRequest(user.slug),
                    }),
                  }
                ]}
              />
            </UserListItem>
          )
          : nothingHere
      }
      <ListSubheader>
        <Divider/>
        <Box
          bgcolor='#282c34'
          align='center'
          component={Typography}
          variant='h5'
        >Friends</Box>
        <Divider/>
      </ListSubheader>
      {friends.map(user =>
        <UserListItem key={user.slug} user={user}>
          <UserListItemActions
            actions={[
              {
                icon: <Send color='primary'/>,
                onClick: () => handleSendMessage(user),
              },
              {
                icon: <Delete color='disabled'/>,
                onClick: () => dialogRef.current.handleOpen({
                  message: `Remove ${user.username} from friends?`,
                  action: () => handleDeleteFriend(user.slug),
                }),
              }
            ]}
          />
        </UserListItem>
      )}
      <LoadMore
        loading={loading}
        onLoadMore={handleLoadMoreFriends}
        empty={!friends?.length && nothingHere}
      />
      <Confrim ref={dialogRef}/>
    </List>
  </ScrollContainer>
}

export default Friends