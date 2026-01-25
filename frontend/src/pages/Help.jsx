import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, BookOpen, PenTool, BarChart2, MessageCircle, ChevronDown, ChevronUp, X, Send, Bot } from 'lucide-react';

const Help = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');
  const [aiReply, setAiReply] = useState('');
  const [displayMessage, setDisplayMessage] = useState('');
  const [formData, setFormData] = useState({ 
    name: JSON.parse(localStorage.getItem('user'))?.name || 'Anonymous',
    email: JSON.parse(localStorage.getItem('user'))?.email || 'N/A',
    topic: 'Technical Issue', 
    message: ''
   });

  const faqs = [
    { q: "How do I create a new quiz?", a: "To create a quiz, go to the Dashboard and click the 'Create Quiz' button. Follow the step-by-step guide to add questions and options." },
    { q: "Can I customize the quiz appearance?", a: "Yes! You can choose from various themes and colors in the 'Edit Quiz' section to match your brand style." },
    { q: "How do I view and analyze quiz results?", a: "Visit the 'Reports' tab. You'll see detailed analytics, performance charts, and student-wise results." },
    { q: "Is there a limit to the number of quizzes I can create?", a: "Currently, you can create unlimited quizzes as part of your standard account." },
    { q: "How do I share my quiz with others?", a: "Every quiz has a unique link. You can copy this link from your 'My Quizzes' list and share it via email or social media." },
    { q: "How can I view or export quiz reports?", a: "In the Reports section, click the 'Download Report (PDF)' button to save a professional copy of your data." },
    { q: "Can I export my data?", a: "Yes, use the 'Download Report (PDF)' button in the Reports section to save a professional copy." }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };


  const handleAskAI = async (e) => {
  e.preventDefault();
  const userMessage = formData.message.toLowerCase(); 

  setDisplayMessage(formData.message);
  setFormData({ ...formData, message: '' });
  setFormStatus('sending'); 

  
  setTimeout(() => {
    let response = "I'm , your QuizMaker Assistant! I can help you create quizzes, view performance reports, or troubleshoot technical issues. What's on your mind?";
    if (userMessage.includes("create") || userMessage.includes("make")) {
      response = "To create a quiz, go to the Dashboard and click 'Create Quiz'. You can add multiple-choice questions and set time limits!";
    } else if (userMessage.includes("report") || userMessage.includes("graph") || userMessage.includes("result")) {
      response = "Your performance data is in the 'Reports' tab. We use real-time data from Cluster0 to show your score averages!";
    } else if (userMessage.includes("hi") || userMessage.includes("hello")) {
      response = "Hello! How can I assist you with your QuizMaker project today?";
    } else if (userMessage.includes("delete") || userMessage.includes("remove")) {
      response = "You can manage and delete your quizzes directly from the 'My Quizzes' section.";
    } else if (userMessage.includes("time") || userMessage.includes("timer")) {
      response = "Yes! When creating a quiz, you can set a countdown timer for the entire quiz to challenge your candidates.";
    } else if (userMessage.includes("pdf") || userMessage.includes("download")) {
      response = "Go to the 'Reports' tab. Click the blue 'Download Report (PDF)' button to get a professional document of all quiz results.";
    } else if (userMessage.includes("share") || userMessage.includes("link")) {
      response = "Every quiz has a unique link! Copy it from your 'My Quizzes' list to share it with students or candidates.";
    } else if (userMessage.includes("cluster0") || userMessage.includes("database")) {
      response = "We use MongoDB Atlas Cluster0 for high-speed data storage, ensuring your quizzes and results are never lost.";
    }
    else if (userMessage.includes("login") || userMessage.includes("account") || userMessage.includes("register")) {
      response = "Users can sign up as 'Candidates'. Once registered, you can access your personal dashboard, track 'My Quizzes', and view your growth in 'Reports'.";
    } 
    else if (userMessage.includes("edit") || userMessage.includes("change") || userMessage.includes("delete")) {
      response = "You can manage your existing quizzes in the 'My Quizzes' tab. From there, you can edit question content or delete quizzes you no longer need.";
    }
    else if (userMessage.includes("who are you") || userMessage.includes("gemini")) {
      response = "I am the built-in AI Assistant for this platform. I was designed to provide instant support for all your quiz-making needs!";
    }

    setAiReply(response); 
    setFormStatus('success');
  }, 700);
};

  return (
    <div className="min-h-screen bg-[#f8faff] font-sans pb-20">
      <div className="bg-white py-16 px-6 border-b border-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl font-black text-[#1a365d] mb-4">Help Center</h1>
          <p className="text-slate-400 font-bold mb-8">How can we assist you today?</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input type="text" placeholder="Search for help..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
          </div>
        </div>
        <div className="hidden lg:block absolute right-20 top-10 opacity-20">
            <MessageCircle size={200} className="text-[#2563eb]" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div 
            onClick={() => setShowGuide(true)}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 hover:border-[#2563eb] hover:-translate-y-1 cursor-pointer transition-all group"
          >
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
              <BookOpen className="text-[#2563eb]" size={30} />
            </div>
            <h3 className="text-xl font-black text-[#1a365d] mb-2">Getting Started</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">Learn the basics of using QuizMaker efficiently.</p>
          </div>

          <div 
            onClick={() => navigate('/create-quiz')}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 hover:border-[#2563eb] hover:-translate-y-1 cursor-pointer transition-all group"
          >
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
              <PenTool className="text-[#2563eb]" size={30} />
            </div>
            <h3 className="text-xl font-black text-[#1a365d] mb-2">Creating Quizzes</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">Step-by-step guide to building engaging quizzes.</p>
          </div>

          <div 
            onClick={() => navigate('/reports')}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 hover:border-[#2563eb] hover:-translate-y-1 cursor-pointer transition-all group"
          >
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
              <BarChart2 className="text-[#2563eb]" size={30} />
            </div>
            <h3 className="text-xl font-black text-[#1a365d] mb-2">Quiz Reports</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">Understand and analyze your results in detail.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-[#1a365d] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl border border-slate-50 overflow-hidden transition-all">
                  <button 
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="font-bold text-[#1a365d]">{faq.q}</span>
                    {activeIndex === index ? <ChevronUp className="text-slate-300" /> : <ChevronDown className="text-slate-300" />}
                  </button>
                  {activeIndex === index && (
                    <div className="p-6 pt-0 text-slate-400 font-medium text-sm leading-relaxed border-t border-slate-50 bg-slate-50/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 text-center h-fit sticky top-6">
            <h3 className="text-2xl font-black text-[#1a365d] mb-4">Need Quick Answers?</h3>
            <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed">
              Our AI Assistant is available 24/7 to answer all your quiz questions instantly.
            </p>
            <button 
              onClick={() => {
                setAiReply('');
                setFormStatus('idle');
                setShowContactForm(true);
              }}
              className="w-full py-4 bg-[#2563eb] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 mb-4 flex items-center justify-center gap-2"
            >
              <Bot size={20} /> Ask AI Assistant
            </button>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Powered by Advanced AI
            </p>
          </div>
        </div>
      </div>

{showContactForm && (
  <div className="fixed inset-0 bg-[#1a365d]/40 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl animate-in zoom-in duration-300 flex flex-col h-[80vh]">
      
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Bot className="text-[#2563eb]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1a365d]">AI Assistant</h2>
            <p className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online Help
            </p>
          </div>
        </div>
        <button onClick={() => setShowContactForm(false)} className="text-slate-300 hover:text-red-500 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
        <div className="self-start bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm">
          <p className="text-slate-600 font-bold text-sm">Hello! I'm your AI assistant. How can I help you with your quizzes today?</p>
        </div>

       {aiReply && (
          <>
            <div className="flex flex-col items-end gap-2">
              <div className="bg-[#2563eb] text-white p-4 rounded-2xl rounded-tr-none max-w-[85%] font-bold shadow-md text-sm">
                {displayMessage} 
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 animate-in slide-in-from-left-4 duration-500">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm text-sm">
                <p className="text-slate-600 font-bold leading-relaxed whitespace-pre-wrap">{aiReply}</p>
              </div>
            </div>
          </>
        )}

        {formStatus === 'sending' && (
          <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] animate-pulse">
            <Bot size={14} />typing...
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-slate-50">
        <form onSubmit={handleAskAI} className="relative flex items-center gap-4">
          <input 
            type="text"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="Ask anything..."
            className="w-full pl-6 pr-16 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            disabled={formStatus === 'sending'}
          />
          <button 
            type="submit"
            disabled={formStatus === 'sending' || !formData.message.trim()}
            className="absolute right-2 p-3 bg-[#2563eb] text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  </div>
)}

      {showGuide && (
        <div className="fixed inset-0 bg-[#1a365d]/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowGuide(false)} className="absolute right-6 top-6 text-slate-300 hover:text-red-500 transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-[#1a365d] mb-6">Welcome to QuizMaker!</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-blue-50 text-[#2563eb] font-black w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">1</div>
                <p className="text-slate-500 font-medium text-sm"><span className="text-[#1a365d] font-bold">Create:</span> Use the Dashboard to design questions.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-50 text-[#2563eb] font-black w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">2</div>
                <p className="text-slate-500 font-medium text-sm"><span className="text-[#1a365d] font-bold">Share:</span> Copy your unique quiz link from 'My Quizzes'.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-50 text-[#2563eb] font-black w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">3</div>
                <p className="text-slate-500 font-medium text-sm"><span className="text-[#1a365d] font-bold">Analyze:</span> Check the Reports tab for live scores.</p>
              </div>
            </div>
            <button onClick={() => setShowGuide(false)} className="w-full mt-10 py-4 bg-[#2563eb] text-white rounded-2xl font-black transition-all hover:bg-blue-700">
              Got it, let's go!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;