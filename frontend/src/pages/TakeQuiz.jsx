import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Send, Timer, HelpCircle, CheckCircle2 } from 'lucide-react';
import QuestionCard from './components/QuestionCard';
import axios from 'axios';

const QuizTimer = ({ initialMinutes, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [secondsLeft, onTimeUp]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-black shadow-sm border border-red-100">
      <Timer size={18} className="animate-pulse" />
      <span className="text-xs uppercase tracking-widest">Time Left:</span>
      <span className="text-lg tabular-nums">{formatTime(secondsLeft)}</span>
    </div>
  );
};

const TakeQuiz = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      navigate('/login'); 
      return;
    }

    const fetchQuiz = async () => {
  try {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    setSelectedOptions({}); 
    setCurrentQuestion(0);
    const { data } = await axios.get(`${apiUrl}/quizzes/${id}`);
    setQuiz(data);
    const res = await axios.get(`${apiUrl}/results/my-results`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const draft = res.data
      .filter(r => (r.quiz?._id || r.quiz) === id && r.status === 'In Progress')
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
      
      if (draft) {
      setCurrentQuestion(draft.currentQuestionIndex || 0);
      const restoredOptions = {};
      data.questions.forEach((q, idx) => {
        const savedAns = draft.answers.find(a => a.questionText === q.questionText);
        if (savedAns) {
          const optionIdx = q.options.indexOf(savedAns.selectedAnswer);
          if (optionIdx !== -1) restoredOptions[idx] = optionIdx;
        }
      });
      setSelectedOptions(restoredOptions);
    }
    setLoading(false);
  } catch (err) {
    console.error("Error fetching quiz", err);
    setLoading(false);
  }
};
    fetchQuiz();
  }, [id, navigate]); 

  const handleOptionSelect = (optionIdx) => {
    setSelectedOptions({ ...selectedOptions, [currentQuestion]: optionIdx });
  };

 const handlePause = async () => {
  try {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    const allDraftAnswers = quiz.questions.map((q, idx) => {
      if (selectedOptions[idx] !== undefined) {
        return {
          questionText: q.questionText,
          selectedAnswer: q.options[selectedOptions[idx]],
          isCorrect: selectedOptions[idx] === q.correctAnswer
        };
      }
      return null;
    }).filter(ans => ans !== null);

    console.log("PAUSING:", allDraftAnswers);
    await axios.post(`${apiUrl}/results`, {
      quizId: quiz._id,
      currentQuestionIndex: currentQuestion,
      status: 'In Progress',
      totalQuestions: quiz.questions.length,
      answers: allDraftAnswers 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    navigate('/my-quizzes');
  } catch (err) {
    console.error("Pause failed:", err);
  }
};
  const handleSubmit = async () => {
    let score = 0;
    const reviewResults = quiz.questions.map((q, idx) => {
      const isCorrect = selectedOptions[idx] === q.correctAnswer;
      if (isCorrect) score++;
      return {
        questionText: q.questionText,
        selectedAnswer: q.options[selectedOptions[idx]],
        correctAnswer: q.options[q.correctAnswer],
        isCorrect
      };
    });

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.post(`${apiUrl}/results`, {
        quizId: quiz._id,
        score,
        totalQuestions: quiz.questions.length,
        answers: reviewResults
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFinalScore(score);
      setShowSuccessModal(true);
    } catch (err) {
      alert("Failed to save results.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Quiz Data...</p>
    </div>
  );

  if (!quiz) return <div className="p-20 text-center text-slate-400 font-bold uppercase">Quiz not found.</div>;

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
  <div className="min-h-screen bg-[#f8faff] py-4 sm:py-8 px-4 sm:px-6 flex flex-col items-center justify-center font-sans">
    <div className="max-w-4xl w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10 gap-6">
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
          <div className="bg-[#1a365d] p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-blue-100 shrink-0">
            <HelpCircle className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-3xl font-black text-[#1a365d] tracking-tight truncate">{quiz.title}</h2>
            <p className="text-slate-400 text-[10px] sm:text-sm font-semibold uppercase tracking-wider">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <QuizTimer initialMinutes={10} onTimeUp={handleSubmit} />
        </div>
      </div>
      <div className="w-full h-2 bg-white rounded-full mb-6 md:mb-10 overflow-hidden shadow-inner">
        <div className="h-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden mb-6 md:mb-10">
        <div className="p-4 sm:p-8">
          <QuestionCard 
            question={quiz.questions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={quiz.questions.length}
            selectedOption={selectedOptions[currentQuestion]}
            onOptionSelect={handleOptionSelect}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:flex md:justify-between items-center bg-white/50 backdrop-blur-md p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-white/50 shadow-sm gap-3 sm:gap-4">
        <button
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          className="flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 bg-white text-slate-500 rounded-xl sm:rounded-2xl font-bold disabled:opacity-30 transition-all border border-slate-100 shadow-sm text-sm sm:text-base"
        >
          <ChevronLeft size={18} /> Prev
        </button>

        <button
          onClick={handlePause}
          className="col-span-2 md:order-2 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-amber-50 text-amber-600 rounded-xl sm:rounded-2xl font-bold hover:bg-amber-100 transition-all border border-amber-100 text-sm sm:text-base"
        >
          Pause Quiz
        </button>
        
        {currentQuestion === quiz.questions.length - 1 ? (
          <button 
            onClick={handleSubmit} 
            className="flex items-center justify-center gap-2 px-4 sm:px-10 py-3 sm:py-4 bg-green-500 text-white rounded-xl sm:rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-600 disabled:bg-slate-200 transition-all active:scale-[0.98] text-sm sm:text-base"
          >
            Submit <Send size={18} />
          </button>
        ) : (
          <button 
            disabled={selectedOptions[currentQuestion] === undefined}
            onClick={() => setCurrentQuestion(currentQuestion + 1)} 
            className="flex items-center justify-center gap-2 px-4 sm:px-10 py-3 sm:py-4 bg-[#1a365d] text-white rounded-xl sm:rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-[#2c5282] disabled:bg-slate-200 transition-all active:scale-[0.98] text-sm sm:text-base"
          >
            Next <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 text-center max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-[#10b981] w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-[#1a365d] mb-2 text-center">Quiz Submitted!</h3>
            <p className="text-slate-500 font-bold mb-2">You scored</p>
            <div className="text-5xl font-black text-[#2563eb] mb-8">{finalScore} / {quiz.questions.length}</div>
            
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-[#10b981] text-white py-4 rounded-2xl font-black hover:bg-[#059669] shadow-lg shadow-green-100 transition-all active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;