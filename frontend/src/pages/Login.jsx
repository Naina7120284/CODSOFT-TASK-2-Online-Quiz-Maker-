import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { login } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      const { data } = await login(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-blue-50 rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-orange-50 rounded-full blur-[100px] opacity-70"></div>
      </div>

      <div className="relative w-full max-w-4xl flex bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="hidden lg:flex w-1/2 bg-[#0f172a] p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-10">
              <div className="bg-blue-600 p-2 rounded-xl">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">QuizMaker</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-6">
              Welcome back to <br /> your <span className="text-blue-500">dashboard.</span>
            </h2>
            
            <div className="space-y-5">
              {[
                "Manage your live quizzes",
                "Review student performance",
                "Access premium analytics"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                  <CheckCircle2 size={18} className="text-blue-500" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-slate-500 text-xs font-medium italic">
              "Education is the most powerful weapon which you can use to change the world."
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Sign In</h2>
            <p className="text-slate-500 text-sm font-medium">Please enter your credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold animate-shake">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <input 
                  type="email" required placeholder="naina@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold text-slate-700 text-sm placeholder:text-slate-300"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Password</label>
                <Link to="/forgot-password" size={10} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <input 
                  type={showPass ? "text" : "password"} 
                  required placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border-2 border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold text-slate-700 text-sm placeholder:text-slate-300"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-6"
            >
              Log In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-6 text-center">
              <p className="text-sm font-medium text-slate-500">
                New to the platform? <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">Create Account</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;