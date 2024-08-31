import mongoose, { Schema } from 'mongoose';

const TestCaseSchema = new Schema ({
    input: {type: String, required: true},
    output: {type: String, required: true},
    explanation: {type: String, required: true},
});

const QuestionSchema = new Schema ({
    name: {type: String, required: true},
    description: {type: String, required: true},
    difficulty: {type: String, required: true}, 
    testCase: [TestCaseSchema],
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);