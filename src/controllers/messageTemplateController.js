import { MessageTemplate } from '../models/MessageTemplate.js';

export async function getMessageTemplates(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.search) {
      filter.$or = [
        { content: new RegExp(req.query.search, 'i') },
        { industry: new RegExp(req.query.search, 'i') },
      ];
    }

    if (req.query.industry) {
      filter.industry = new RegExp(req.query.industry, 'i');
    }

    const [data, total] = await Promise.all([
      MessageTemplate.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MessageTemplate.countDocuments(filter),
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
    console.error('Get message templates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

