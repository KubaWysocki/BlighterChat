import {useContext, useState} from 'react'
import {AppBar, TextField, InputAdornment, Avatar, Toolbar, Box} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import UserContext from '../../util/UserContext'

const Navigation = () => {
  const [user] = useContext(UserContext)

  return <AppBar color='transparent'>
    <Toolbar variant='dense'>
      <TextField
        fullWidth
        placeholder='Search…'
        InputProps={{
          startAdornment:
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        }}
      />
      <Box ml={1.5}>
        <Avatar src={null}>K</Avatar>
      </Box>
    </Toolbar>
  </AppBar>
}

export default Navigation