import express from 'express';
import { getSubjectTemplates } from '../controllers/subjectTemplateController.js';
// import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// router.use(authenticateToken); // Uncomment to enable authentication

router.get('/', getSubjectTemplates);

export default router;

