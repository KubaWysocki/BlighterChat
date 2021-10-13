import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import {createTheme, ThemeProvider, StylesProvider, CssBaseline} from '@material-ui/core'

import App from './App'
import reportWebVitals from './reportWebVitals'

import './index.scss'

const theme = createTheme({palette: {type: 'dark'}})

ReactDOM.render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Router>
          <App/>
        </Router>
      </ThemeProvider>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()