import express from 'express';
import multer from 'multer';
import path from 'path';
import os from 'os';
import { getLeads, createLead, uploadLeads } from '../controllers/leadController.js';
// import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// router.use(authenticateToken); // Uncomment to enable authentication

router.get('/', getLeads);
router.post('/', createLead);
router.post('/upload', upload.single('file'), uploadLeads);

export default router;

