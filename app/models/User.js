import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isSubscribed: { type: Boolean, default: false },
  questions: [{
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    isCompleted: { type: Boolean, default: false }
  }]
});

export default mongoose.models.User || mongoose.model("User", userSchema);
