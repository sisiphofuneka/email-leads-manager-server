import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  mainEmail: { type: String, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

accountSchema.index({ name: 1 });
accountSchema.index({ mainEmail: 1 });

export const Account = mongoose.model('Account', accountSchema);

