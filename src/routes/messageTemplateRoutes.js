import express from 'express';
import { getMessageTemplates } from '../controllers/messageTemplateController.js';
// import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// router.use(authenticateToken); // Uncomment to enable authentication

router.get('/', getMessageTemplates);

export default router;

