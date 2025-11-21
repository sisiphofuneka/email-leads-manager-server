import { Lead } from '../models/Lead.js';
import fs from 'fs/promises';

export async function getLeads(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { Email: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { company: searchRegex },
      ];
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }

    const [data, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
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
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createLead(req, res) {
  try {
    const leadData = {
      ...req.body,
      Email: req.body.Email || req.body.email,
    };

    if (!leadData.Email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const lead = new Lead(leadData);
    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    console.error('Create lead error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Lead with this email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function uploadLeads(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }


    const results = [];
    const errors = [];
    let processed = 0;

    // Read and parse CSV
    const filePath = req.file.path;
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      await fs.unlink(filePath).catch(() => {});
      return res.status(400).json({ error: 'CSV file must have at least a header and one data row' });
    }

    // Parse CSV (handle quoted values)
    function parseCSVLine(line) {
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    }

    // Parse header
    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, ''));

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const row = {};

      headers.forEach((header, index) => {
        if (values[index]) {
          row[header] = values[index];
        }
      });

      if (row.email) {
        try {
          const leadData = {
            Email: row.email || '',
            status: row.status || 'unused',
            firstName: row.firstname || row['firstname'] || row['first_name'] || '',
            lastName: row.lastname || row['lastname'] || row['last_name'] || '',
            company: row.company || '',
            title: row.title || '',
            phone: row.phone || '',
            linkedin: row.linkedin || '',
            website: row.website || '',
            city: row.city || '',
            state: row.state || '',
            country: row.country || '',
            assignedTo: row.assignedto || row['assignedto'] || row['assigned_to'] || null,
          };

          if (!leadData.Email) {
            errors.push({ row: i + 1, error: 'Email is required' });
            continue;
          }

          // Check if lead already exists
          const existing = await Lead.findOne({ Email: leadData.Email.toLowerCase() });
          if (!existing) {
            const lead = new Lead(leadData);
            await lead.save();
            results.push(lead);
            processed++;
          } else {
            errors.push({ row: i + 1, email: leadData.Email, error: 'Lead already exists' });
          }
        } catch (error) {
          errors.push({ row: i + 1, error: error.message });
        }
      } else {
        errors.push({ row: i + 1, error: 'Email is required' });
      }
    }

    // Clean up uploaded file
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Error deleting temp file:', err);
    }

    res.json({
      success: true,
      processed,
      created: results.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Upload leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

