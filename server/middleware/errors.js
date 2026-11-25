/** Never leak stack traces or internals to visitors. */
export function notFound(req, res) {
  res.status(404).json({ error: 'Not found.' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request is too large.' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' });
  if (err.message === 'CORS') return res.status(403).json({ error: 'Origin not allowed.' });
  console.error('[error]', err.message);
  res.status(500).json({ error: 'Something went wrong. Please try again later.' });
}
