import {TextField, Box} from '@material-ui/core'
import {useContext} from 'react'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'

import axios from '../../util/axios'
import * as urls from '../../util/urls'
import * as api from '../../util/api'
import * as validators from '../../util/validators'
import {LS_TOKEN} from '../../util/constants'
import initNotifications from '../../util/initNotifications'
import UserContext from '../../contexts/UserContext'
import NotificationsContext from '../../contexts/NotificationsContext'
import SubmitButton from './SubmitButton'


const Login = (props) => {
  const {register, errors, handleSubmit, setError} = useForm()
  const history = useHistory()
  const setUser = useContext(UserContext)[1]
  const setNotifications = useContext(NotificationsContext)[1]

  const usedRegister = props.register || register
  const usedErrors = props.errors || errors

  const handleLogin = async(data) => {
    axios.post(api.LOGIN, data)
      .then(res => {
        localStorage.setItem(LS_TOKEN.KEY, LS_TOKEN.PRESENT)
        setUser(res.data)

        props.onInitIO()

        axios.get(api.NOTIFICATIONS_COUNT)
          .then(res => {
            setNotifications(initNotifications(res.data))
            history.push(urls.FEED)
          })
      })
      .catch(error => {
        const errors = error.response.data.message
        for (const key in errors) {
          setError(key, {type: 'manual', message: errors[key]})
        }
      })
  }

  return <Box
    component={props.register ? 'div' : 'form'}
    mx='auto'
    width='fit-content'
    py={props.register ? 0 : 2}
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
      placeholder='N0t5o0bv10u5Pa55w0rd'
      error={!!usedErrors.password}
      helperText={usedErrors.password?.message}
      inputRef={usedRegister(validators.password)}
    />
    {!props.register && <SubmitButton text='Login'/>}
  </Box>
}

export default Login