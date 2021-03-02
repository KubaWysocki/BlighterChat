import {useState} from 'react'
import {AppBar, TextField, InputAdornment, Toolbar} from '@material-ui/core'
import {Search} from '@material-ui/icons'

import AppMenu from './AppMenu'
import SearchList from './SearchList'
import useDebounce from '../../Hooks/useDebounce'


const Navigation = () => {
  const [search, setSearch] = useState(null)
  const debouncedSearch = useDebounce(search, 500)

  const handleClear = () => setSearch(null)

  return <>
    <AppBar color='transparent'>
      <Toolbar variant='dense'>
        <TextField
          fullWidth
          placeholder='Search…'
          value={search || ''}
          onChange={(e) => setSearch(e.target.value || null)}
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
      <SearchList search={debouncedSearch} onClear={handleClear}/>
    }
  </>
}

export default Navigation