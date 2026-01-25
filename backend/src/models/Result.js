const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, required: true },
  currentQuestionIndex: { type: Number, default: 0 },
  status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
  visibleToAdmin: { type: Boolean, default: true },
  answers: [{
    questionText: String,
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
  }]
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);