import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

emailSchema.index({ email: 1 });

export const Email = mongoose.model('Email', emailSchema);

