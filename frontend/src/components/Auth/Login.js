import {TextField, Box} from '@material-ui/core'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'

import axios from '../../util/axios'
import SubmitButton from './SubmitButton'
import * as validators from '../../util/validators'


const Login = (props) => {
  const {register, errors, handleSubmit, setError} = useForm()
  const history = useHistory()

  const usedRegister = props.register || register
  const usedErrors = props.errors || errors

  const handleLogin = async(data) => {
    axios.post('/login', data)
      .then(res => {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userId', res.data.userId)
        history.push('/profile/Kuba')
      })
      .catch(error => {
        const errors = error.response.data
        for (const key in errors) {
          setError(key, {type: 'manual', message: errors[key]})
        }
      })
  }

  return <Box
    component={props.register ? 'div' : 'form'}
    mx='auto'
    width='fit-content'
    py={props.register ? undefined : 2}
    onSubmit={!props.register ? handleSubmit(handleLogin) : undefined}
  >
    <TextField
      autoFocus={!props.register}
      name='username'
      label='Username'
      margin='normal'
      placeholder='user_login'
      error={!!usedErrors.username}
      helperText={usedErrors.username?.message}
      inputRef={usedRegister(validators.username)}
    />
    <br/>
    <TextField
      name='password'
      type='password'
      label='Password'
      margin='normal'
      placeholder='N0t5o0bv10u5Pa55word'
      error={!!usedErrors.password}
      helperText={usedErrors.password?.message}
      inputRef={usedRegister(validators.password)}
    />
    {!props.register && <SubmitButton/>}
  </Box>
}

export default Login