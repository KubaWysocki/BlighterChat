import {useState} from 'react'
import {Switch, Route} from 'react-router-dom'

import * as urls from './util/urls'
import UserContext from './util/UserContext'

import Auth from './components/Auth/Auth'
import Profile from './components/Profile/Profile'
import Navigation from './components/Navigation/Navigation'

function App() {
  const userContext = useState({})

  return (
    <Switch>
      <Route path={urls.UNAUTHENTICATED}>
        <Auth/>
      </Route>
      <Route path='/'>
        <UserContext.Provider value={userContext}>
          <Navigation/>
          <Route path={urls.PROFILE}>
            <Profile/>
          </Route>
        </UserContext.Provider>
      </Route>
    </Switch>
  )
}

export default App