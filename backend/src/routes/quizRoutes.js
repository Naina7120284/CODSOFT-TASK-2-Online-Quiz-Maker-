const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createQuiz, getQuizzes, getQuizById, deleteQuiz, updateQuiz } = require('../controllers/quizController');


router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.put('/:id', protect, updateQuiz);
router.post('/', protect, createQuiz);
router.delete('/:id', protect, deleteQuiz);

module.exports = router; 