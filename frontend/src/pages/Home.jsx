import React, { useEffect, useState,} from 'react';
import axios from 'axios';
import CustomModal from './components/CustomModal';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, BarChart3, Edit3, MoreHorizontal, Search, Trash2} from 'lucide-react'; 
import { fetchQuizzes } from '../services/api';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'success' });
  const [quizIdToDelete, setQuizIdToDelete] = useState(null);

  useEffect(() => {
    const loadDB = async () => {
      try {
        const response = await fetchQuizzes();
        const actualData = response.data.quizzes || response.data;
        setQuizzes(Array.isArray(actualData) ? actualData : []);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDB();
  }, []);

  const initiateDelete = (id) => {
  setQuizIdToDelete(id);
  setModalConfig({
    title: 'Confirm Deletion',
    message: 'Are you sure? This quiz will be permanently removed from the site.',
    type: 'warning'
  });
  setShowModal(true);
};


const handleConfirmDeleteQuiz = async () => {
   if (!quizIdToDelete) return;
   const apiUrl = import.meta.env.VITE_API_URL;
    try {
    const token = localStorage.getItem('token');
    await axios.delete(`${apiUrl}/quizzes/${quizIdToDelete}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setQuizzes(prev => prev.filter(q => q._id !== quizIdToDelete));
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
    console.error("Delete Failed:", err.message);
    setShowModal(false);
  }
};
  
 return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-700">
      
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left max-w-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-4">
              Create & Manage <br /> 
              <span className="text-blue-600">Your Quizzes</span>
            </h1>
            <p className="text-slate-500 text-base font-medium mb-6">
              Easily build, customize, and analyze your quizzes with <br className="hidden md:block"/> 
              our intuitive, professional dashboard.
            </p>
            {user?.role === 'admin' && (
         <Link to="/create-quiz" className="...">
         <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95"></button>
         </Link>
        )}
          </div>
          
          <div className="hidden lg:block relative">
            <div className="w-[380px] h-[260px] bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center justify-center p-6 overflow-hidden">
               <img 
                src="https://illustrations.popsy.co/amber/web-design.svg" 
                alt="Illustration" 
                className="w-full h-auto drop-shadow-xl" 
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Plus />, title: 'Create Quiz', desc: 'Build with ease.', color: 'blue', link: '/create-quiz' },
            { icon: <LayoutGrid />, title: 'My Quizzes', desc: 'View & edit.', color: 'indigo', link: '/my-quizzes' },
            { icon: <BarChart3 />, title: 'Reports', desc: 'Analyze stats.', color: 'sky', link: '/reports' }
          ].map((card, i) => (
            <Link key={i} to={card.link || '#'} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex items-center gap-4">
              <div className={`bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all`}>
                {React.cloneElement(card.icon, { size: 22 })}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{card.title}</h3>
                <p className="text-slate-400 text-xs font-medium">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Recent Quizzes</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-3">Quiz Title</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Questions</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
               {loading ? (
                 <tr><td colSpan="4" className="py-10 text-center text-slate-400 text-sm italic font-medium">Connecting to QuizMaker...</td></tr>
              ) : quizzes.map((quiz) => (
               <tr key={quiz._id} className="hover:bg-slate-50/50 transition-colors group">
                 <td className="px-6 py-4 font-bold text-[#1a365d] text-sm">{quiz.title}</td>
      
              <td className="px-6 py-4">
                 <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  quiz.status === 'Draft' ? 'bg-orange-100 text-orange-600' : 'bg-green-500 text-white shadow-sm shadow-green-100'
               }`}>
                 {quiz.status || 'Active'}
             </span>
         </td>

       <td className="px-6 py-4 text-xs text-slate-500 font-bold">{quiz.questions?.length || 0} Questions</td>

        <td className="px-6 py-4 text-right">
          <div className="flex justify-end items-center gap-4">
           {user?.role === 'admin' ? (
            <>

              <Link 
                to={`/edit/${quiz._id}`} 
                className="text-blue-600 hover:bg-blue-50 font-black text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all border border-blue-50"
              >
                <Edit3 size={14} /> Edit
              </Link>
             <button 
                onClick={() => initiateDelete(quiz._id)} 
                className="text-red-500 hover:bg-red-50 font-black text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all border border-red-50"
            >
              <Trash2 size={14} /> Delete
            </button>
            </>
           ) : (
            <Link 
              to={`/take-quiz/${quiz._id}`} 
              className="bg-[#1a365d] text-white hover:bg-[#2c5282] font-black text-xs px-5 py-2 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              Take Quiz
            </Link>
            )}
          </div>
         </td>
        </tr>
     ))}
   </tbody>
            </table>
          </div>
        </div>
      </main>
      <footer className="py-12 border-t border-slate-200 text-center">
        <div className="flex justify-center gap-8 mb-4 text-sm font-semibold text-blue-600">
          <a href="#" className="hover:text-blue-800">Terms</a>
          <a href="#" className="hover:text-blue-800">Privacy</a>
          <a href="#" className="hover:text-blue-800">Contact</a>
        </div>
        <p className="text-xs text-slate-400 font-medium">© 2026 QuizMaker • All rights reserved.</p>
      </footer>
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

export default Home;