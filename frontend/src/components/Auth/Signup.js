import {useContext} from 'react'
import {TextField, Box} from '@material-ui/core'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'

import * as urls from '../../util/urls'
import * as api from '../../util/api'
import * as validators from '../../util/validators'

import axios from '../../util/axios'
import {LS_TOKEN} from '../../util/constants'
import UserContext from '../../contexts/UserContext'
import Login from './Login'
import SubmitButton from './SubmitButton'

const Signup = ({onInitIO}) => {
  const {register, watch, errors, setError, handleSubmit} = useForm()
  const history = useHistory()
  const setUser = useContext(UserContext)[1]

  const handleSignup = (data) => {
    axios.put(api.NEW_USER, data)
      .then((res) => {
        localStorage.setItem(LS_TOKEN.KEY, LS_TOKEN.PRESENT)
        setUser(res.data)
        onInitIO()
        history.push(urls.PROFILE + res.data.slug)
      })
      .catch(error => {
        const errors = error.response.data.message
        for (const key in errors) {
          setError(key, {type: 'manual', message: errors[key]})
        }
      })
  }

  return <Box
    component='form'
    mx='auto'
    width='fit-content'
    py={2}
    onSubmit={handleSubmit(handleSignup)}
  >
    <TextField
      autoFocus
      name='username'
      type='username'
      label='Username'
      margin='normal'
      placeholder='example_user'
      error={!!errors.username}
      helperText={errors.username?.message}
      inputRef={register(validators.username)}
    />
    <Login
      register={register}
      errors={errors}
    />
    <TextField
      name='confirmPassword'
      label='Confirm Password'
      type='password'
      margin='normal'
      placeholder='N0t5o0bv10u5Pa55word'
      error={!!errors.confirmPassword}
      helperText={errors.confirmPassword?.message}
      inputRef={register({
        validate: value => value === watch('password') || 'Passwords must match'
      })}
    />
    <SubmitButton text='Signup'/>
  </Box>
}

export default Signup