import {TextField, Box} from '@material-ui/core'
import {useContext} from 'react'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'

import axios from '../../util/axios'
import * as urls from '../../util/urls'
import * as api from '../../util/api'
import SubmitButton from './SubmitButton'
import * as validators from '../../util/validators'
import UserContext from '../../util/UserContext'


const Login = (props) => {
  const {register, errors, handleSubmit, setError} = useForm()
  const history = useHistory()
  const setUser = useContext(UserContext)[1]

  const usedRegister = props.register || register
  const usedErrors = props.errors || errors

  const handleLogin = async(data) => {
    axios.post(api.LOGIN, data)
      .then(res => {
        const {token, ...userData} = res.data
        localStorage.setItem('token', token)
        Object.assign(axios.defaults, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        setUser(userData)
        history.push(urls.FEED)
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
      name='email'
      type='email'
      label='Email'
      margin='normal'
      placeholder='example@mail.com'
      error={!!usedErrors.email}
      helperText={usedErrors.email?.message}
      inputRef={usedRegister(validators.email)}
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