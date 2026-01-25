const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true } 
  }],
  status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);