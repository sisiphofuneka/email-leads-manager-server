import mongoose from 'mongoose';

const subjectTemplateSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  used: { type: Number, default: 0 },
  replied: { type: Number, default: 0 },
  succeeded: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

subjectTemplateSchema.index({ content: 'text' });
subjectTemplateSchema.index({ createdAt: -1 });

export const SubjectTemplate = mongoose.model('SubjectTemplate', subjectTemplateSchema);

