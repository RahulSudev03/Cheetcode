import mongoose, { Schema } from 'mongoose';

const FunctionSchema = new Schema({
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    function: { type: String, required: true },
    language: { type: String, required: true },
});

export default mongoose.models.Function || mongoose.model('Function', FunctionSchema);
