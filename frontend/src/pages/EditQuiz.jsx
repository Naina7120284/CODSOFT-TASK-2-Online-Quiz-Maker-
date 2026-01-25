import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomModal from './components/CustomModal';
import { Layout, PlusCircle, Trash2, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/quizzes/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      setTitle(response.data.title);
      setQuestions(response.data.questions || []); 
      setLoading(false);
      
    } catch (err) {
      console.error("Fetch Error:", err);
      setLoading(false);
    }
  };
  fetchData();
}, [id]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.put(`${apiUrl}/quizzes/${id}`,
        { title, questions },
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      setShowSuccess(true); 
      
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      alert("Failed to update quiz.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb]"></div>
    </div>
  );

 return (
    <div className="min-h-screen bg-[#f8faff] py-6 px-4 md:px-8 font-sans">
      <div className="max-w-3xl mx-auto"> 
        
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-4 hover:text-[#2563eb] transition-all">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#2563eb] p-2 rounded-xl shadow-md">
            <Layout className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-black text-[#1a365d] tracking-tight">Edit <span className="text-[#2563eb]">Quiz</span></h1>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-50">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Quiz Title</label>
            <input 
              type="text" value={title} 
              className="w-full p-3 bg-slate-50 border-none rounded-xl text-lg font-black text-[#1a365d] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
              onChange={(e) => setTitle(e.target.value)} required 
            />
          </div>

          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-blue-50 text-[#2563eb] font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest">Question {qIdx + 1}</span>
                  <button type="button" onClick={() => handleRemoveQuestion(qIdx)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                <input 
                  type="text" value={q.questionText} placeholder="Enter question..."
                  className="w-full p-2.5 mb-4 bg-transparent border-b border-slate-100 text-base font-bold text-slate-700 outline-none focus:border-[#2563eb] transition-all"
                  onChange={(e) => {
                    const newQs = [...questions];
                    newQs[qIdx].questionText = e.target.value;
                    setQuestions(newQs);
                  }} required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${q.correctAnswer === oIdx ? 'border-[#10b981] bg-green-50/50' : 'border-slate-50 bg-slate-50/30'}`}>
                      <input 
                        type="radio" checked={q.correctAnswer === oIdx}
                        className="w-4 h-4 accent-[#10b981] cursor-pointer"
                        onChange={() => {
                          const newQs = [...questions];
                          newQs[qIdx].correctAnswer = oIdx;
                          setQuestions(newQs);
                        }}
                      />
                      <input 
                        type="text" value={opt} placeholder={`Option ${oIdx + 1}`}
                        className="bg-transparent w-full outline-none font-bold text-sm text-slate-600"
                        onChange={(e) => {
                          const newQs = [...questions];
                          newQs[qIdx].options[oIdx] = e.target.value;
                          setQuestions(newQs);
                        }} required
                      />
                      {q.correctAnswer === oIdx && <CheckCircle2 size={14} className="text-[#10b981]" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-10">
            <button 
              type="button" onClick={handleAddQuestion} 
              className="flex-1 bg-white text-[#2563eb] border border-[#2563eb] py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-98 shadow-sm"
            >
              <PlusCircle size={18} /> Add New Question
            </button>
            
            <button 
              type="submit" 
              className="flex-[1.2] bg-[#10b981] text-white py-3 rounded-xl font-black text-sm shadow-md shadow-green-100 hover:bg-[#059669] hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
      <CustomModal 
          isOpen={showSuccess} 
          onClose={() => { setShowSuccess(false); navigate('/'); }}
          title="Update Successful" 
          message="The quiz has been successfully updated." 
       />
    </div>
  );
};

export default EditQuiz;