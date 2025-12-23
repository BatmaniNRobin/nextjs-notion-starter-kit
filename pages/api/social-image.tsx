// Temporarily disable social image API during Node 25 compatibility work.
// Original implementation moved to pages/api/social-image.orig.tsx

export default function handler(req, res) {
  res.status(204).end()
}
