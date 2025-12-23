// Simple server-side shim for browser globals used during SSR/prerender.
// This file is intended to be prepended to the server webpack entry so that
// modules which expect `localStorage` won't crash during static generation.

if (typeof global !== 'undefined') {
  if (typeof global.localStorage === 'undefined') {
    global.localStorage = {
      getItem(key) {
        return null
      },
      setItem(key, value) {
        // noop
      },
      removeItem(key) {
        // noop
      },
      clear() {
        // noop
      }
    }
  }
}
