import {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Paper, List, Typography, ListSubheader} from '@material-ui/core'
import {Send} from '@material-ui/icons'

import * as api from '../../util/api'
import * as urls from '../../util/urls'
import useLoadMore from '../../Hooks/useLoadMore'
import UserListItem from '../UserListItem/UserListItem'
import UserListItemActions from '../UserListItem/UserListItemActions'
import LoadMore from '../LoadMore/LoadMore'
import ScrollContainer from '../Generic/ScrollContainer'


const SearchList = ({search, onClear}) => {
  const history = useHistory()
  const [friends, setFriends] = useState([])
  const [users, setUsers] = useState([])

  const query = search && `?search=${search}`

  const [loadingFriends, handleLoadMoreFriends] = useLoadMore(api.FRIENDS, setFriends, 0, query)
  const [loadingUsers, handleLoadMoreUsers] = useLoadMore(api.GET_USERS, setUsers, 0, query)

  return <ScrollContainer
    component={Paper}
    position='relative'
    zIndex='tooltip'>
    <List dense>
      <ListSubheader>
        <Paper component={Typography} variant='subtitle1' elevation={0} square>
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
        <Paper component={Typography} variant='subtitle1' elevation={0} square>
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
  </ScrollContainer>
}

export default SearchList