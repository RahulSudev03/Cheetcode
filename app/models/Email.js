// models/Email.js
import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Email || mongoose.model('Email', EmailSchema);
