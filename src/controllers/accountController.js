import { Account } from '../models/Account.js';

export async function getAccounts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Account.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Account.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getAccount(req, res) {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    console.error('Get account error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid account ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createAccount(req, res) {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Account name is required' });
    }

    const account = new Account(req.body);
    await account.save();

    res.status(201).json(account);
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateAccount(req, res) {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(account);
  } catch (error) {
    console.error('Update account error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid account ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteAccount(req, res) {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid account ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

