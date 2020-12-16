import {useEffect, useState} from 'react'
import {Switch, Route, useHistory} from 'react-router-dom'

import axios from './util/axios'
import * as urls from './util/urls'
import * as api from './util/api'
import {LOGGED_OUT} from './util/constants'
import UserContext from './util/UserContext'

import Auth from './components/Auth/Auth'
import Profile from './components/Profile/Profile'
import Navigation from './components/Navigation/Navigation'
import Spinner from './components/Spinner/Spinner'
import Friends from './components/Friends/Friends'

function App() {
  const userContext = useState(null)
  const setUser = userContext[1]
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      history.push(`${urls.UNAUTHENTICATED}?new`)
      return setLoading(false)
    }
    if (token === LOGGED_OUT) {
      history.push(`${urls.UNAUTHENTICATED}?known`)
      return setLoading(false)
    }
    axios.get(api.AUTO_LOGIN)
      .then(res => {
        const {token, ...userData} = res.data
        localStorage.setItem('token', token)
        Object.assign(axios.defaults, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        setUser(userData)
        setLoading(false)
        if(history.location.pathname === urls.SLASH ||
          history.location.pathname.includes(urls.UNAUTHENTICATED)) {
          history.push(urls.FEED)
        }
      })
      .catch(() => {
        history.push(`${urls.UNAUTHENTICATED }?known`)
        return setLoading(false)
      })
  }, [history, setUser])

  if (loading) return <Spinner/>

  return (
    <Switch>
      <UserContext.Provider value={userContext}>
        <Route render={({location}) =>
          [urls.SLASH, urls.UNAUTHENTICATED].includes(location.pathname)
            ? null
            : <Navigation/>
        }/>
        <Route path={urls.UNAUTHENTICATED}>
          <Auth/>
        </Route>
        <Route path={urls.PROFILE}>
          <Profile/>
        </Route>
        <Route path={urls.FRIENDS}>
          <Friends/>
        </Route>
      </UserContext.Provider>
    </Switch>
  )
}

export default App