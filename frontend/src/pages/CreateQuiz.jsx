import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomModal from './components/CustomModal';
import { PlusCircle, Trash2, CheckCircle2, Layout, ShieldAlert, ArrowRight } from 'lucide-react';
import axios from 'axios';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);


  useEffect(() => {
    setIsVerifying(false);
    if (user?.role !== 'admin') {
      const timer = setTimeout(() => navigate('/'), 5000);
      return () => clearTimeout(timer); 
    }
  }, [user, navigate]);

  
   if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center p-6 font-sans">
        <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 text-center shadow-2xl shadow-blue-50 border border-slate-50 animate-in fade-in zoom-in duration-500">
          <div className="bg-blue-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
            <ShieldAlert className="text-[#2563eb]" size={48} />
          </div>

          <h2 className="text-3xl font-black text-[#1a365d] mb-4">Admin Only Access</h2>
          <p className="text-slate-400 font-bold leading-relaxed mb-10">
            Oops! This section is reserved for <span className="text-[#2563eb]">Administrators</span>. 
            As a Candidate, you can head back to the dashboard to take active quizzes!
          </p>

          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-[#2563eb] text-white rounded-2xl font-black text-sm shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            Go to Dashboard <ArrowRight size={18} />
          </button>
          
          <p className="mt-4 text-[10px] font-black text-slate-300 uppercase">Redirecting in 5 seconds...</p>
        </div>
      </div>
    );
  }

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const quizData = { title, questions };
  const apiUrl = import.meta.env.VITE_API_URL;
  try {
    const token = localStorage.getItem('token');
    await axios.post(`${apiUrl}/quizzes`, quizData, {
        headers: { Authorization: `Bearer ${token}` }
   });
    setIsSuccessModalOpen(true); 

  } catch (err) {
    console.error("Error creating quiz:", err);
  }
};

  if (isVerifying) return null;

  return (
    <div className="min-h-screen bg-[#f8faff] py-12 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
            <Layout className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[#1a365d]">Create New Quiz</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Quiz Title</label>
            <input 
              type="text" placeholder="e.g., General Knowledge Quiz" 
              className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xl font-semibold outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setTitle(e.target.value)} required 
            />
          </div>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-blue-50 text-blue-600 font-bold px-4 py-1 rounded-full text-xs">Question {qIdx + 1}</span>
                <button type="button" onClick={() => handleRemoveQuestion(qIdx)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={20} />
                </button>
              </div>

              <input 
                type="text" placeholder="Enter your question here..."
                className="w-full p-3 mb-6 bg-transparent border-b-2 border-gray-100 text-lg font-medium focus:border-blue-600 outline-none"
                onChange={(e) => {
                  const newQs = [...questions];
                  newQs[qIdx].questionText = e.target.value;
                  setQuestions(newQs);
                }} required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${q.correctAnswer === oIdx ? 'border-green-500 bg-green-50' : 'border-gray-50'}`}>
                    <input 
                      type="radio" name={`correct-${qIdx}`} checked={q.correctAnswer === oIdx}
                      onChange={() => {
                        const newQs = [...questions];
                        newQs[qIdx].correctAnswer = oIdx;
                        setQuestions(newQs);
                      }}
                    />
                    <input 
                      type="text" placeholder={`Option ${oIdx + 1}`}
                      className="bg-transparent w-full outline-none text-sm font-medium"
                      onChange={(e) => {
                        const newQs = [...questions];
                        newQs[qIdx].options[oIdx] = e.target.value;
                        setQuestions(newQs);
                      }} required
                    />
                    {q.correctAnswer === oIdx && <CheckCircle2 size={18} className="text-green-500" />}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-4">
            <button type="button" onClick={handleAddQuestion} className="flex-1 bg-white text-blue-600 border-2 border-blue-600 p-4 rounded-2xl font-bold hover:bg-blue-50 transition-all flex justify-center items-center gap-2">
              <PlusCircle size={20} /> Add Another Question
            </button>
            <button type="submit" className="flex-[2] bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all">
              Save Quiz
            </button>
          </div>
        </form>
      </div>
      <CustomModal 
          isOpen={isSuccessModalOpen} 
          onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/my-quizzes'); 
       }}
         title="Quiz Created!" 
         message="Your new quiz has been successfully saved." 
      />
    </div>
  );
};

export default CreateQuiz;