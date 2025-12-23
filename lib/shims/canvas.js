// Minimal shim for the `canvas` native module used by pdfjs-dist in SSR builds.
// This prevents the bundler from failing to resolve 'canvas' during the Next.js
// build. The shim provides the minimal API pdfjs may call at build-time. It's
// intentionally lightweight and not suitable for actual PDF rendering — keep
// using a real canvas implementation at runtime if needed.

function createCanvas(width, height) {
  return {
    width: width || 0,
    height: height || 0,
    getContext() {
      return {
        // no-op context methods that might be called during static analysis
        fillRect() { /* noop */ },
        drawImage() { /* noop */ },
        putImageData() { /* noop */ },
        beginPath() { /* noop */ },
        moveTo() { /* noop */ },
        lineTo() { /* noop */ },
        stroke() { /* noop */ },
        fillText() { /* noop */ },
        measureText() {
          return { width: 0 }
        }
      }
    }
  }
}

module.exports = {
  createCanvas
}
