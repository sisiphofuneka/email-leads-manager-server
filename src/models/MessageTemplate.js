import mongoose from 'mongoose';

const messageTemplateSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  industry: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
  used: { type: Number, default: 0 },
  replied: { type: Number, default: 0 },
  succeeded: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

messageTemplateSchema.index({ content: 'text', industry: 'text' });
messageTemplateSchema.index({ industry: 1 });
messageTemplateSchema.index({ createdAt: -1 });

export const MessageTemplate = mongoose.model('MessageTemplate', messageTemplateSchema);

