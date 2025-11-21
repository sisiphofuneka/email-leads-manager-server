import { Email } from '../models/Email.js';
import { Account } from '../models/Account.js';

export async function getEmails(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.email = searchRegex;
    }

    const [data, total] = await Promise.all([
      Email.find(filter)
        .populate('account', 'name firstName lastName mainEmail')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Email.countDocuments(filter),
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
    console.error('Get emails error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createEmail(req, res) {
  try {
    if (!req.body.email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailData = {
      email: req.body.email.toLowerCase(),
      account: req.body.accountId || null,
    };

    const email = new Email(emailData);
    await email.save();

    await email.populate('account', 'name firstName lastName mainEmail');

    res.status(201).json(email);
  } catch (error) {
    console.error('Create email error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    if (error.name === 'CastError' && error.path === 'account') {
      return res.status(400).json({ error: 'Invalid account ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

