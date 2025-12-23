// Minimal SSR-safe shim for a subset of `react-use` hooks used by this
// project. This avoids calling browser-only APIs during server-side
// prerendering (like localStorage.getItem) which causes build-time errors.

const React = require('react')

function useLocalStorage(key, initialValue) {
  const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

  const getValue = () => {
    try {
      if (!isBrowser) return initialValue
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch (err) {
      return initialValue
    }
  }

  const [state, setState] = React.useState(getValue)

  React.useEffect(() => {
    try {
      if (!isBrowser) return
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch (err) {
      // noop
    }
  }, [key, state])

  return [state, setState]
}

function useWindowSize() {
  const isBrowser = typeof window !== 'undefined'
  const getSize = () => ({ width: isBrowser ? window.innerWidth : 0, height: isBrowser ? window.innerHeight : 0 })

  const [size, setSize] = React.useState(getSize)

  React.useEffect(() => {
    if (!isBrowser) return
    function onResize() {
      setSize(getSize())
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return size
}

module.exports = {
  useLocalStorage,
  useWindowSize
}
