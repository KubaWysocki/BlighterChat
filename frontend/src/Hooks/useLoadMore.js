import {useEffect, useCallback, useRef, useState} from 'react'

import axios from '../util/axios'

const useLoadMore = (url, setState, startingPage = 0, query='') => {
  const page = useRef(startingPage)
  const [loading, setLoading] = useState(startingPage === 0 ? true : false)

  const handleLoadMore = useCallback(() => {
    if (query !== null) {
      setLoading(true)
      axios.get(`${url}/${page.current}${query}`)
        .then(res => {
          setState(state => [...state, ...res.data.content])
          setLoading(res.data.isLast ? null : false)
          page.current += 1
        })
    }
  }, [url, setState, query])

  useEffect(() => {
    page.current = startingPage
    setState([])
    handleLoadMore()
  }, [startingPage, setState, handleLoadMore])

  return [loading, handleLoadMore]
}

export default useLoadMore