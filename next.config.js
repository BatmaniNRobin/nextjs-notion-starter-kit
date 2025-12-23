// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  // Minimal turbopack config for Next 16+ compatibility.
  // Set root to project directory to avoid lockfile/root inference warnings.
  // transpilePackages will force SWC to transpile problematic CJS/ESM packages
  // (fixes named-export interop issues like `react-use` used by react-notion-x).
  turbopack: {
    root: __dirname
  },
  transpilePackages: ['react-use', 'react-notion-x'],
  webpack: (config, { isServer }) => {
    // Alias native `canvas` module to a lightweight shim for builds where
    // the native dependency isn't available (prevents Turbopack build errors).
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    const path = require('path')
    config.resolve.alias['canvas'] = path.resolve(
      __dirname,
      'lib/shims/canvas.js'
    )
    // Alias react-use to our SSR-safe shim to avoid calling localStorage on server
    config.resolve.alias['react-use'] = path.resolve(
      __dirname,
      'lib/shims/react-use.js'
    )

    if (isServer) {
      const serverShim = path.resolve(__dirname, 'lib/shims/server-globals.js')
      const originalEntry = config.entry
      config.entry = async () => {
        const entries = await originalEntry()
        // Prepend shim to every entry array so it's always executed on the server
        Object.keys(entries).forEach((entryName) => {
          const entryValue = entries[entryName]
          if (Array.isArray(entryValue) && !entryValue.includes(serverShim)) {
            entryValue.unshift(serverShim)
          }
        })

        return entries
      }
    }

    return config
  },
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      's3.us-west-2.amazonaws.com',
      'transitivebullsh.it'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
})
