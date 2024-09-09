import mongoose, { Schema } from 'mongoose';

const SavedCodeSchema = new Schema({
  username: { type: String, required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true }, // Add language field
});

export default mongoose.models.SavedCode || mongoose.model('SavedCode', SavedCodeSchema);
