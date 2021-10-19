import axios from '../util/axios'
import renderer from 'react-test-renderer'
import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {createMemoryHistory} from 'history'
import {Router} from 'react-router-dom'

import App from '../App'
import {LS_TOKEN} from '../util/constants'

jest.mock('../components/Feed/Feed', () => () => 'FEED_MOCK')
jest.mock('../components/Navigation/Navigation', () => () => 'NAVIGATION_MOCK')

describe('App test', () => {
  let history
  let axiosSpy

  const userDataMock = {data: {username: 'User', slug: 'user', email: 'user@user.com'}}
  const dataMock = {data: {}}

  beforeEach(() => {
    history = createMemoryHistory({initialEntries: ['/anything']})
    axiosSpy = jest.spyOn(axios, 'get')
  })

  afterEach(() => {
    axiosSpy.mockRestore()
  })

  test('App renders spinner when loading', () => {
    const component = renderer.create(
      <App/>
    )
    const three = component.toJSON()
    expect(three).toMatchSnapshot()
  })

  test('App redirects to Signup page when there is no info about user', () => {
    render(
      <Router history={history}>
        <App/>
      </Router>
    )

    expect(history.location.pathname + history.location.search).toBe('/unauthenticated?new')
  })

  test('App redirects to Login page when user logged out', () => {
    localStorage.setItem(LS_TOKEN.KEY, LS_TOKEN.LOGGED_OUT)

    render(
      <Router history={history}>
        <App/>
      </Router>
    )

    expect(history.location.pathname + history.location.search).toBe('/unauthenticated?known')
  })

  test('App redirects to Login page when auto login fails', async() => {
    localStorage.setItem(LS_TOKEN.KEY, LS_TOKEN.PRESENT)

    axiosSpy.mockRejectedValueOnce()

    render(
      <Router history={history}>
        <App/>
      </Router>
    )

    await waitFor(() => {
      expect(axiosSpy).toHaveBeenCalledTimes(1)
    })

    expect(history.location.pathname + history.location.search).toBe('/unauthenticated?known')
  })

  test('App redirects to Feed on success auto login if route was /', async() => {
    localStorage.setItem(LS_TOKEN.KEY, LS_TOKEN.PRESENT)

    history.push('/')

    axiosSpy
      .mockResolvedValueOnce(userDataMock)
      .mockResolvedValueOnce(dataMock)

    render(
      <Router history={history}>
        <App/>
      </Router>
    )

    await waitFor(() => {
      expect(axiosSpy).toHaveBeenCalledTimes(2)
    })

    expect(history.location.pathname).toBe('/feed')
  })

  test('App redirects to Feed on success auto login if route was /unauthenticated', async() => {
    localStorage.setItem(LS_TOKEN.KEY, LS_TOKEN.PRESENT)

    history.push('/unauthenticated')

    axiosSpy
      .mockResolvedValueOnce(userDataMock)
      .mockResolvedValueOnce(dataMock)

    render(
      <Router history={history}>
        <App/>
      </Router>
    )

    await waitFor(() => {
      expect(axiosSpy).toHaveBeenCalledTimes(2)
    })

    expect(history.location.pathname).toBe('/feed')
  })

  test('App stays on entered page when auto login succeds and route was not one of tests above', async() => {
    localStorage.setItem(LS_TOKEN.KEY, LS_TOKEN.PRESENT)

    axiosSpy
      .mockResolvedValueOnce(userDataMock)
      .mockResolvedValueOnce(dataMock)

    render(
      <Router history={history}>
        <App/>
      </Router>
    )

    await waitFor(() => {
      expect(axiosSpy).toHaveBeenCalledTimes(2)
    })

    expect(history.location.pathname).toBe('/anything')
  })
})