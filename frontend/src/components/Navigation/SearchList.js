import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {Paper, Box, List, ListItem, ListItemAvatar, Typography, Avatar} from '@material-ui/core'

import * as api from '../../util/api'
import * as urls from '../../util/urls'
import axios from '../../util/axios'
import useDebounce from '../../Hooks/useDebounce'
import Spinner from '../Spinner/Spinner'

const SearchList = ({search, onClear}) => {
  const [users, setUsers] = useState([])
  const [isSearching, setIsSearching] = useState(true)
  const debouncedSearch = useDebounce(search, 1000)
  const history = useHistory()

  useEffect(() => {
    setIsSearching(true)
    axios.get(`${api.GET_USERS}?search=${debouncedSearch}`)
      .then(res => {
        setUsers(res.data)
        setIsSearching(false)
      })
      .catch(() => {
        setIsSearching(false)
      })
  }, [debouncedSearch])

  const handleItemClick = (userPath) => {
    history.push(userPath)
    onClear()
  }

  return <Box
    component={Paper}
    width={1}
    mt={6}
    position='absolute'
    display='flex'
    flexDirection='column'>
    <List dense>
      <Box component={ListItem}>
        <Typography variant='subtitle1'>Users:</Typography>
      </Box>
      {isSearching
        ? <Spinner/>
        : users.length
          ? users.map(user =>
            <Box
              button
              width={1}
              component={ListItem}
              key={user.slug}
              onClick={() => handleItemClick(urls.PROFILE + user.slug)}>
              <ListItemAvatar>
                <Box component={Avatar} height={35} width={35}>{user.username[0]}</Box>
              </ListItemAvatar>
              {user.username}
            </Box>
          )
          : <Typography variant='body2' align='center'>Users not found</Typography>
      }
    </List>
  </Box>
}

export default SearchList