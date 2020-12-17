import {useState} from 'react'
import {AppBar, TextField, InputAdornment, Toolbar} from '@material-ui/core'
import {Search} from '@material-ui/icons'

import AppMenu from './AppMenu'
import SearchList from './SearchList'


const Navigation = () => {
  const [search, setSearch] = useState('')

  const handleClear = () => setSearch('')

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
        <AppMenu onClear={handleClear}/>
      </Toolbar>
    </AppBar>
    {search &&
      <SearchList search={search} onClear={handleClear}/>
    }
  </>
}

export default Navigation