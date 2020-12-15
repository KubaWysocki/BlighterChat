import {useState} from 'react'
import {AppBar, TextField, InputAdornment, Toolbar} from '@material-ui/core'
import {Search} from '@material-ui/icons'

import AppMenu from './Menu'
import SearchList from './SearchList'


const Navigation = () => {
  const [search, setSearch] = useState('')

  return <>
    <AppBar color='transparent'>
      <Toolbar variant='dense'>
        <TextField
          fullWidth
          placeholder='Search…'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment:
            <InputAdornment position='start'>
              <Search/>
            </InputAdornment>
          }}
        />
        <AppMenu/>
      </Toolbar>
    </AppBar>
    {search &&
      <SearchList search={search} onClear={() => setSearch('')}/>
    }
  </>
}

export default Navigation