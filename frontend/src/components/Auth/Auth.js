import {useState} from 'react'
import {Tabs, Tab, Box} from '@material-ui/core'

import Login from './Login'
import Signup from './Signup'

const Signin = (props) => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [<Login/>, <Signup/>]

  return <Box pt='10%'>
    <Tabs
      indicatorColor='primary'
      textColor='primary'
      centered
      value={activeTab}
      onChange={(e, value) => setActiveTab(value)}
    >
      <Tab label='Login'/>
      <Tab label='Signup'/>
    </Tabs>
    {tabs[activeTab]}
  </Box>
}

export default Signin