import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import CustomModal from './components/CustomModal';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [strength, setStrength] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setFormData({ ...formData, password: pass });
    let score = 0;
    if (pass.length > 7) score++; 
    if (/[A-Z]/.test(pass)) score++; 
    if (/[0-9]/.test(pass)) score++; 
    if (/[^A-Za-z0-9]/.test(pass)) score++; 
    setStrength(score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending Data:", formData);
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, formData);
      setModalContent({
        title: "Welcome to QuizMaker!",
       message: "Your account has been created successfully. You can now log in."
      });
     setIsModalOpen(true);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-50 rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-orange-50 rounded-full blur-[100px] opacity-70"></div>
      </div>

      <div className="relative w-full max-w-4xl flex bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="hidden lg:flex w-1/2 bg-[#0f172a] p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-blue-600 p-2 rounded-xl">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">QuizMaker</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-5">
              Start your journey <br /> with <span className="text-blue-500">precision.</span>
            </h2>
            
            <div className="space-y-4">
              {[
                "Create unlimited dynamic quizzes",
                "Advanced real-time analytics",
                "Secure learner authentication"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                  <CheckCircle2 size={18} className="text-blue-500" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-slate-500 text-[11px] font-medium italic">
              "The best way to predict the future is to create it."
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Create Account</h2>
            <p className="text-slate-500 text-sm font-medium">Join our community of educators today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <input 
                  type="text" required placeholder="Full Name"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold text-slate-700 text-sm placeholder:text-slate-300"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

           <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email" required placeholder="@gmail.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-100 transition-all font-semibold"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Your Role</label>
              <select 
                className="w-full p-2.5 bg-slate-50 rounded-xl outline-none border-2 border-transparent focus:border-blue-100 font-semibold text-slate-700"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="candidate">Candidate (Student)</option>
                <option value="admin">Admin (Educator)</option>
              </select>
            </div>

            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <input 
                  type={showPass ? "text" : "password"} 
                  required placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold text-slate-700 text-sm placeholder:text-slate-300"
                  onChange={handlePasswordChange}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              <div className="mt-2 px-1">
                <div className="flex gap-1 h-1 mb-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-all duration-500 ${
                        i < strength 
                          ? (strength <= 2 ? 'bg-orange-400' : 'bg-blue-600') 
                          : 'bg-slate-100'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                  Strength: {strength < 2 ? 'Weak' : strength === 3 ? 'Good' : 'Excellent'}
                </span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-2"
            >
              Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-4 text-center">
              <p className="text-sm font-medium text-slate-500">
                Already part of the team? <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <CustomModal 
         isOpen={isModalOpen} 
         onClose={() => {
         setIsModalOpen(false);
         navigate('/login'); 
     }}
     title={modalContent.title} 
     message={modalContent.message} 
   />
    </div>
  );
};

export default Register;