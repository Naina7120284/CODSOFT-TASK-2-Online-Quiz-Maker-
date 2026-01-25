const Result = require('../models/Result');

exports.saveResult = async (req, res) => {
  const { quizId, score, totalQuestions, answers, currentQuestionIndex, status } = req.body;
  try {
    let result = await Result.findOne({ 
      user: req.user.id, 
      quiz: quizId, 
      status: 'In Progress' 
    });

    if (result) {
      result.score = score || 0;
      result.totalQuestions = totalQuestions;
      result.answers = answers;
      result.currentQuestionIndex = currentQuestionIndex;
      result.status = status || 'Completed';
      await result.save();
    } else {

      result = new Result({
        user: req.user.id,
        quiz: quizId,
        score: score || 0,
        totalQuestions,
        answers,
        currentQuestionIndex,
        status: status || 'In Progress',
        visibleToAdmin: true
      });
      await result.save();
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id }).populate('quiz', 'title');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllResults = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'admin') {
      query = { visibleToAdmin: true, status: 'Completed' };
    } else {
      query = { user: req.user.id }; 
    }

    const results = await Result.find(query)
      .populate('user', 'name email')
      .populate('quiz', 'title');
      
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearAllResults = async (req, res) => {
  try {
    await Result.updateMany({}, { $set: { visibleToAdmin: false } }); 
    res.status(200).json({ message: "history cleared successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};