import express from 'express';
import {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../controllers/accountController.js';
// import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// router.use(authenticateToken); // Uncomment to enable authentication

router.get('/', getAccounts);
router.get('/:id', getAccount);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

export default router;

