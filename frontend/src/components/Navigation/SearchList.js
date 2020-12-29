import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {Paper, Box, List, ListItem, Typography} from '@material-ui/core'
import {Send} from '@material-ui/icons'

import * as api from '../../util/api'
import * as urls from '../../util/urls'
import axios from '../../util/axios'
import useDebounce from '../../Hooks/useDebounce'
import Spinner from '../Spinner/Spinner'
import UserListItem from '../UserListItem/UserListItem'
import UserListItemActions from '../UserListItem/UserListItemActions'


const SearchList = ({search, onClear}) => {
  const history = useHistory()
  const [friends, setFriends] = useState(null)
  const [users, setUsers] = useState(null)
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    setFriends(null)
    axios.get(`${api.FRIENDS}?search=${debouncedSearch}`)
      .then(res => setFriends(res.data))
      .catch(() => setFriends([]))

    setUsers(null)
    axios.get(`${api.GET_USERS}?search=${debouncedSearch}`)
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
  }, [debouncedSearch])

  return <Box
    component={Paper}
    width={1}
    mt={6}
    position='absolute'
    display='flex'
    flexDirection='column'
    zIndex='tooltip'>
    <List dense>
      <Box component={ListItem}>
        <Typography variant='subtitle1'>Friends:</Typography>
      </Box>
      {friends === null
        ? <Spinner/>
        : friends.length
          ? friends.map(user =>
            <UserListItem key={user.slug} user={user} onClick={onClear}>
              <UserListItemActions
                actions={[
                  {
                    icon: <Send color='primary'/>,
                    onClick: () => history.push(`${urls.CHAT}?receiver=${user.slug}`, {username: user.username}),
                  }
                ]}
              />
            </UserListItem>
          )
          : <Typography variant='body2' align='center'>Friends not found</Typography>
      }
      <Box component={ListItem}>
        <Typography variant='subtitle1'>Users:</Typography>
      </Box>
      {users === null
        ? <Spinner/>
        : users.length
          ? users.map(user =>
            <UserListItem key={user.slug} user={user} onClick={onClear}/>
          )
          : <Typography variant='body2' align='center'>Users not found</Typography>
      }
    </List>
  </Box>
}

export default SearchList