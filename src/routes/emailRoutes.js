import express from 'express';
import { getEmails, createEmail } from '../controllers/emailController.js';
// import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// router.use(authenticateToken); // Uncomment to enable authentication

router.get('/', getEmails);
router.post('/', createEmail);

export default router;

