import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { postContact } from '../controllers/contact.js';

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true }));

// At most 5 contact messages per IP every 15 minutes.
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many messages. Please try again later.' } });
router.post('/contact', contactLimiter, postContact);

export default router;
