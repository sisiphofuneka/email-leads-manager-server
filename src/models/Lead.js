import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  Email: { type: String, required: true, lowercase: true, trim: true },
  status: { type: String, enum: ['unused', 'sent', 'bad', 'bounced', 'opened', 'replied', 'demoed'], default: 'unused' },
  sentAt: { type: Date, default: null },
  assignedTo: { type: String, default: null },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  company: { type: String, trim: true },
  title: { type: String, trim: true },
  phone: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  website: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

leadSchema.index({ Email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model('Lead', leadSchema);

