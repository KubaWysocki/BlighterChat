import {useContext} from 'react'
import {TextField, Box} from '@material-ui/core'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'

import * as urls from '../../util/urls'
import * as api from '../../util/api'
import * as validators from '../../util/validators'

import UserContext from '../../util/UserContext'
import axios from '../../util/axios'
import Login from './Login'
import SubmitButton from './SubmitButton'

const Signup = (props) => {
  const {register, watch, errors, setError, handleSubmit} = useForm()
  const history = useHistory()
  const setUser = useContext(UserContext)[1]

  const handleSignup = (data) => {
    axios.put(api.NEW_USER, data)
      .then((res) => {
        const {token, ...userData} = res.data
        localStorage.setItem('token', token)
        Object.assign(axios.defaults, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        setUser(userData)
        history.push(`${urls.PROFILE + userData.username}/${userData.id}`)
      })
      .catch(error => {
        const errors = error.response.data
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
    <SubmitButton/>
  </Box>
}

export default Signup