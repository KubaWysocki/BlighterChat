import {TextField, Box} from '@material-ui/core'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'

import axios from '../../util/axios'
import Login from './Login'
import SubmitButton from './SubmitButton'

import * as urls from '../../util/urls'
import * as api from '../../util/api'
import * as validators from '../../util/validators'

const Signup = (props) => {
  const {register, watch, errors, setError, handleSubmit} = useForm()
  const history = useHistory()

  const handleSignup = (data) => {
    axios.put(api.NEW_USER, data)
      .then((res) => {
        history.push(urls.PROFILE + res.data.username)
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
      name='email'
      type='email'
      label='Email'
      margin='normal'
      placeholder='example@domain.com'
      error={!!errors.email}
      helperText={errors.email?.message}
      inputRef={register(validators.email)}
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