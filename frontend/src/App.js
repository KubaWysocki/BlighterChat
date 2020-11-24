import {Switch, Route} from 'react-router-dom'
import styles from './App.module.scss'

function App() {
  return (
    <div className={styles.App}>
      <Switch>
        <Route path="/" exact>
          <div>lol</div>
        </Route>
      </Switch>
    </div>
  )
}

export default App