import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CustomModal from './components/CustomModal';
import { LayoutGrid, Search, Edit3, Trash2, PlayCircle, ArrowLeft, BookOpen } from 'lucide-react';
import axios from 'axios';

const MyQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'success' });
  const [quizToDelete, setQuizToDelete] = useState(null);
  const closeModal = () => setModalInfo({ ...modalInfo, isOpen: false });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizIdToDelete, setQuizIdToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); 

      const apiUrl = import.meta.env.VITE_API_URL;
      if (!token) {
        navigate('/login'); 
        return;
      }

      try {
        const [quizRes, resultRes] = await Promise.all([
          axios.get(`${apiUrl}/quizzes`),
          axios.get(`${apiUrl}/results/my-results`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setQuizzes(quizRes.data);
        setUserResults(resultRes.data); 
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttemptStatus = (quizId) => {
    const attempts = userResults
    .filter(r => (r.quiz?._id || r.quiz)?.toString() === quizId.toString())
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const latestAttempt = attempts[0];

    if (latestAttempt) {
    if (latestAttempt.status === 'In Progress') {
      return { 
        text: "Paused", 
        score: `At Q: ${latestAttempt.currentQuestionIndex + 1}`,
        color: 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100',
        resume: true 
      };
    }
      
      return { 
      text: "Attempted", 
      score: `Score: ${latestAttempt.score}/${latestAttempt.totalQuestions}`,
      color: 'text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100',
      done: true 
    };
  }
    return { 
      text: 'Not Attempted',
       score: '', 
       color: 'text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg', 
       done: false 
    };
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
    </div>
  );

  const handleStartQuiz = (quizId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    setModalInfo({
      isOpen: true,
      title: "Authentication Required",
      message: "Please login to participate in the quiz!."
    });
    return;
  }
  navigate(`/take-quiz/${quizId}`);
};

const initiateDelete = (quizId) => {
  setQuizIdToDelete(quizId);
  setModalConfig({
    title: 'Confirm Deletion',
    message: 'Are you sure? This quiz will be permanently removed.',
    type: 'warning'
  });
  setShowModal(true);
};

const handleConfirmDeleteQuiz = async () => {
  try {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    await axios.delete(`${apiUrl}/quizzes/${quizIdToDelete}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    

    setQuizzes(quizzes.filter(q => q._id !== quizIdToDelete));
    setShowModal(false);
    setTimeout(() => {
      setModalConfig({
        title: 'Quiz Deleted!',
        message: 'The quiz has been successfully removed.',
        type: 'success'
      });
      setShowModal(true);
    }, 500);
  } catch (err) {
    console.error("Delete failed:", err);
  }
};
  

  return (
    <div className="min-h-screen bg-[#f8faff] py-8 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-6 hover:text-[#2563eb] transition-all">
          <ArrowLeft size={16} /> Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-[#2563eb] p-3 rounded-2xl shadow-lg shadow-blue-100">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-[#1a365d] tracking-tight">My <span className="text-[#2563eb]">Quizzes</span></h1>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search quizzes..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-600" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const status = getAttemptStatus(quiz._id); 

            return (
              <div key={quiz._id} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-green-50 text-[#10b981] font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest">{quiz.status || 'Active'}</span>
                  <span className="text-slate-300 font-bold text-[10px]">{quiz.questions?.length || 0} Qs</span>
                </div>

                <h3 className="text-xl font-black text-[#1a365d] mb-6 group-hover:text-[#2563eb] transition-colors line-clamp-1">{quiz.title}</h3>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  {user?.role === 'admin' ? (
                    <div className="flex gap-4">
                      <Link to={`/edit/${quiz._id}`} className="text-slate-400 hover:text-blue-600 transition-colors"><Edit3 size={18} /></Link>
                     <button 
                        onClick={() => initiateDelete(quiz._id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                     >
                         <Trash2 size={18} />
                     </button>
                    </div>
                  ) : (

                    <div className={`text-[10px] font-black uppercase tracking-wider flex flex-col ${status.color}`}>
                      <span>{status.text}</span>
                      {status.score && <span className="text-[8px] opacity-80">{status.score}</span>}
                    </div>
                  )}

                 <button 
                    onClick={() => handleStartQuiz(quiz._id)} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all shadow-sm ${
                      status.resume 
                      ? 'bg-amber-500 text-white hover:bg-amber-600' 
                      : 'bg-[#f8faff] text-[#1a365d] hover:bg-[#2563eb] hover:text-white'
                    }`}
                  >
                        <PlayCircle size={16} /> 
                        {user?.role === 'admin' ? 'Preview' : (status.resume ? 'Resume' : (status.done ? 'Retake' : 'Start'))}
                  </button>
                </div>
              </div>
             );
            })}
          </div>
       </div>
           <CustomModal 
             isOpen={modalInfo.isOpen} 
             onClose={closeModal} 
             title={modalInfo.title} 
             message={modalInfo.message} 
           />
             {showModal && (
                <CustomModal
                 isOpen={showModal}
                 title={modalConfig.title}
                 message={modalConfig.message}
                 type={modalConfig.type}
                 onClose={() => setShowModal(false)}
                 onConfirm={modalConfig.type === 'warning' ? handleConfirmDeleteQuiz : null}
                 />
               )}
          </div>
         );
        };

export default MyQuizzes;