import {useCallback, useState} from 'react'
import {useHistory} from 'react-router'
import {useForm} from 'react-hook-form'
import {Avatar, Box, Checkbox, Fab, InputAdornment, List, ListItem, TextField, Typography} from '@material-ui/core'
import {Add, Cancel, Search} from '@material-ui/icons'

import axios from '../../util/axios'
import * as api from '../../util/api'
import * as urls from '../../util/urls'
import ChatTopBar from '../Chat/ChatTopBar'
import useDebounce from '../../Hooks/useDebounce'
import useLoadMore from '../../Hooks/useLoadMore'
import UserListItem from '../UserListItem/UserListItem'
import LoadMore from '../LoadMore/LoadMore'
import ScrollContainer from '../Generic/ScrollContainer'


const NewChat = () => {
  const history = useHistory()
  const [search, setSearch] = useState('')
  const [friends, setFriends] = useState([])

  const debouncedSearch = useDebounce(search, 500)
  const query = debouncedSearch && `?search=${debouncedSearch}`

  const [loadingFriends, handleLoadMoreFriends] = useLoadMore(api.FRIENDS, setFriends, 0, query)

  const {register, formState: {errors}, handleSubmit, setValue, watch} = useForm({
    defaultValues: {selected: []}
  })

  register('selected', {
    validate: val => val.length < 1 ? 'You need to select users' : undefined
  })
  const selected = watch('selected')

  const debouncedName = useDebounce(watch('chatName'), 500)

  const handleSelection = useCallback(user =>
    setValue(
      'selected',
      selected.findIndex(({slug}) => slug === user.slug) === -1
        ? selected.concat(user)
        : selected.filter(({slug}) => slug !== user.slug)
    )
  , [selected, setValue])

  const validateChatName = useCallback(val => {
    if (selected.length === 1) return undefined
    else if (val.length < 3) return 'Chat name too short'
    else if (val.length > 20) return 'Chat name too long'
  }, [selected])

  const createChat = ({selected, chatName}) => {
    if (selected.length === 1) {
      return history.push(`${urls.CHAT}?receiver=${selected[0].slug}`, {name: selected[0].username})
    }
    axios.put(api.CREATE_CHAT, {
      slugs: selected.map(user => user.slug),
      chatName
    })
      .then(({data}) => {
        history.push(`${urls.CHAT}/${data.slug}`, {name: data.name})
      })
  }

  const {chatNameRef, ...chatNameRest} = register('chatName', {validate: validateChatName})

  return <>
    <ChatTopBar name={debouncedName || 'New Chat'}/>
    <ScrollContainer
      px={4}
      height={1}
      display='flex'
      flexDirection='column'
      justifyContent='space-around'
      component='form'
      onSubmit={handleSubmit(createChat)}>
      <TextField
        fullWidth
        name='chatName'
        label='Chat name'
        margin='dense'
        error={!!errors.chatName}
        helperText={errors.chatName?.message}
        inputRef={chatNameRef}
        {...chatNameRest}
      />
      <Box component={List} display='flex' overflow='auto' minHeight='6em'>
        {selected.map(user =>
          <Box
            key={user.slug}
            component={ListItem}
            display='flex'
            flexDirection='column'
            maxWidth='max-content'
            minWidth='4.1em'>
            <Avatar>{user.username[0]}</Avatar>
            <Typography variant='caption'>{user.username}</Typography>
            <Box
              component={Cancel}
              fontSize='medium'
              position='absolute'
              right={0}
              onClick={() => handleSelection(user)}
            />
          </Box>
        )}
      </Box>
      <TextField
        fullWidth
        placeholder='Search friends…'
        value={search || ''}
        onChange={(e) => setSearch(e.target.value)}
        error={!!errors.selected}
        InputProps={{
          startAdornment:
            <InputAdornment position='start'>
              <Search color={errors.selected ? 'error' : undefined}/>
            </InputAdornment>
        }}
      />
      <Box component={List} overflow='auto' maxHeight={.7}>
        {friends.map(user =>
          <UserListItem
            key={user.slug}
            user={user}
            withoutLink
            onClick={() => handleSelection(user)}>
            <Box ml='auto'>
              <Checkbox
                edge="start"
                checked={selected.findIndex(selected => selected.slug === user.slug) !== -1}
                tabIndex={-1}
                disableRipple
              />
            </Box>
          </UserListItem>
        )}
        <LoadMore
          loading={loadingFriends}
          onLoadMore={handleLoadMoreFriends}
          empty={
            !friends?.length && <Typography variant='body2' align='center'>Friends not found</Typography>
          }
        />
      </Box>
      {errors.selected &&
        <Typography color='error' variant='caption'>
          {errors.selected.message}
        </Typography>
      }
      <Box maxWidth='max-content' mx='auto' my={1}>
        <Fab type='submit' variant='extended' color='primary' size='medium'>
          <Add/>
          Create chat
        </Fab>
      </Box>
    </ScrollContainer>
  </>
}

export default NewChat