/**
 * ToolKitWorld API (optional).
 * The website's tools run entirely in the browser; this server only handles
 * the contact form. Deploy it to any free Node host and set VITE_API_URL in the client.
 */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import api from './routes/api.js';
import { errorHandler, notFound } from './middleware/errors.js';

export const app = express();
app.set('trust proxy', 1); // correct client IPs behind the host's proxy (for rate limiting)
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => (!origin || config.allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error('CORS'))),
  methods: ['GET', 'POST'],
}));
app.use(rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: 'draft-7', legacyHeaders: false })); // general limit
app.use(express.json({ limit: '20kb' }));
app.use('/api', api);
app.use(notFound);
app.use(errorHandler);

if (process.argv[1] === new URL(import.meta.url).pathname) {
  app.listen(config.port, () => console.log(`ToolKitWorld API on http://localhost:${config.port} (allowed origins: ${config.allowedOrigins.join(', ')})`));
}
