import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Paper, List, Typography, ListSubheader, Box} from '@material-ui/core'
import {Send} from '@material-ui/icons'

import * as api from '../../util/api'
import * as urls from '../../util/urls'
import useLoadMore from '../../Hooks/useLoadMore'
import UserListItem from '../UserListItem/UserListItem'
import UserListItemActions from '../UserListItem/UserListItemActions'
import LoadMore from '../LoadMore/LoadMore'


const SearchList = ({search, onClear}) => {
  const history = useHistory()
  const [friends, setFriends] = useState([])
  const [users, setUsers] = useState([])

  const query = search && `?search=${search}`

  const [loadingFriends, handleLoadMoreFriends] = useLoadMore(api.FRIENDS, setFriends, 0, query)
  const [loadingUsers, handleLoadMoreUsers] = useLoadMore(api.GET_USERS, setUsers, 0, query)

  return <Box
    component={Paper}
    position='absolute'
    width={1}
    maxHeight='calc(100% - 48px)'
    mt={6}
    overflow="auto"
    zIndex='tooltip'>
    <List dense>
      <ListSubheader>
        <Paper component={Typography} elevation={0} square>
          Friends:
        </Paper>
      </ListSubheader>
      <List>
        {friends.map(user =>
          <UserListItem key={user.slug} user={user} onClick={onClear}>
            <UserListItemActions
              actions={[
                {
                  icon: <Send color='primary'/>,
                  onClick: () => history.push(`${urls.CHAT}?receiver=${user.slug}`, {name: user.username}),
                }
              ]}
              onClick={onClear}
            />
          </UserListItem>
        )}
      </List>
      <LoadMore
        loading={loadingFriends}
        onLoadMore={handleLoadMoreFriends}
        empty={
          !friends?.length && <Typography variant='body2' align='center'>Friends not found</Typography>
        }
      />
      <ListSubheader>
        <Paper component={Typography} elevation={0} square>
          Users:
        </Paper>
      </ListSubheader>
      <List>
        {users.map(user =>
          <UserListItem key={user.slug} user={user} onClick={onClear}/>
        )}
      </List>
      <LoadMore
        loading={loadingUsers}
        onLoadMore={handleLoadMoreUsers}
        empty={
          !users?.length && <Typography variant='body2' align='center'>Users not found</Typography>
        }
      />
    </List>
  </Box>
}

export default SearchList