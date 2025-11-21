import { SubjectTemplate } from '../models/SubjectTemplate.js';

export async function getSubjectTemplates(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.search) {
      filter.content = new RegExp(req.query.search, 'i');
    }

    const [data, total] = await Promise.all([
      SubjectTemplate.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SubjectTemplate.countDocuments(filter),
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
    console.error('Get subject templates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

