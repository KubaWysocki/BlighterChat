import {useState, useEffect} from 'react'
import {Paper, Box, List, ListItem, Typography} from '@material-ui/core'

import * as api from '../../util/api'
import axios from '../../util/axios'
import useDebounce from '../../Hooks/useDebounce'
import Spinner from '../Spinner/Spinner'
import UserListItem from '../UserListItem/UserListItem'

const SearchList = ({search, onClear}) => {
  const [users, setUsers] = useState([])
  const [isSearching, setIsSearching] = useState(true)
  const debouncedSearch = useDebounce(search, 1000)

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
        <Typography variant='subtitle1'>Users:</Typography>
      </Box>
      {isSearching
        ? <Spinner/>
        : users.length
          ? users.map(user =>
            <UserListItem user={user} onClick={onClear}/>
          )
          : <Typography variant='body2' align='center'>Users not found</Typography>
      }
    </List>
  </Box>
}

export default SearchList