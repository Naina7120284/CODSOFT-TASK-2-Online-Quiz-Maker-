import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, CheckCircle, Search, FileText, ArrowLeft, Download, Trash2 } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import CustomModal from './components/CustomModal';
import autoTable from 'jspdf-autotable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Reports = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'success' });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
  const fetchAllResults = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;

      const { data } = await axios.get(`${apiUrl}/results`, {
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      console.log("Fetched Data for Admin:", data); 
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err.response?.status, err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchAllResults();
}, []);


const displayResults = user?.role === 'admin' 
  ? results 
  : results.filter(r => (r.user?._id || r.user) === user?._id);

const totalResponses = displayResults.length;

const avgScore = totalResponses > 0 
  ? Math.round((displayResults.reduce((acc, curr) => {
      const score = curr.score || 0;
      const total = curr.totalQuestions || 1; 
      return acc + (score / total);
    }, 0) / totalResponses) * 100) 
  : 0;


const filteredResults = displayResults.filter(report => {
  const studentName = report.user?.name || '';
  const quizTitle = report.quiz?.title || '';
  return (
    studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Quiz Performance Report", 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    const tableColumn = ["Candidate", "Quiz Title", "Score", "Date"];
    const tableRows = results.map(result => [
      result.user?.name || 'Anonymous',
      result.quiz?.title || 'General Quiz',
      `${result.score} / ${result.totalQuestions}`,
      new Date(result.createdAt).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }, 
      styles: { fontSize: 9, font: 'helvetica' }
    });

    doc.save(`Quiz_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const chartData = displayResults.reduce((acc, curr) => {
    const quizTitle = curr.quiz?.title || 'General Quiz';
    const scorePercent = ((curr.score || 0) / (curr.totalQuestions || 1)) * 100;

    const existing = acc.find(item => item.name === quizTitle);
    if (existing) {
      existing.totalScore += scorePercent;
      existing.attempts += 1;
      existing.avgScore = Math.round(existing.totalScore / existing.attempts);
    } else {
      acc.push({ 
        name: quizTitle, 
        avgScore:Math.round(scorePercent),
        totalScore: scorePercent,
        attempts: 1 
      });
    }
    return acc;
  }, []);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
    </div>
  );

const clearAllReports = async () => {
  setModalConfig({
    title: 'Confirm Deletion',
    message: 'Are you sure? This will permanently delete ALL candidate results.',
    type: 'warning'
  });
  setShowModal(true);
};

const handleConfirmDelete = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    await axios.delete(`${apiUrl}/results/clear-all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setResults([]); 
    setShowModal(false);
    setTimeout(() => {
      setModalConfig({
        title: 'History Cleared!',
        message: 'All candidate reports have been successfully removed.',
        type: 'success'
      });
      setShowModal(true);
    }, 500);

  } catch (err) {
    console.error("Clear History Failed:", err);
  }
};
  
  return (
    <div className="min-h-screen bg-[#f8faff] py-6 px-6 md:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 font-bold text-xs mb-2 hover:text-[#2563eb] transition-all">
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-black text-[#1a365d]">Quiz <span className="text-[#2563eb]">Reports</span></h1>
          </div>

          <div className="flex gap-3">
           {user?.role === 'admin' && (
            <button 
              onClick={clearAllReports}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-black text-xs hover:bg-red-100 transition-all active:scale-95"
            >
             <Trash2 size={18} /> Clear All History
             </button>
        )}
           <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-[#2563eb] text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            <Download size={18} /> Download Report (PDF)
          </button>
        </div>
      </div>
          
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 mb-10">
          <div className="mb-6">
            <h2 className="text-xl font-black text-[#1a365d]">Quiz Performance Overview</h2>
            <p className="text-slate-400 font-bold text-xs mt-1">
              {user?.role === 'admin' ? "Real-time averages from Cluster0" : "Your score history"}
           </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} domain={[0, 100]} />
                <Tooltip cursor={{fill: '#f8faff'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="avgScore" radius={[8, 8, 8, 8]} barSize={45}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="bg-blue-50 p-4 rounded-2xl"><Users className="text-[#2563eb]" /></div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {user?.role === 'admin' ? "Total Responses" : "Quizzes Taken"}
              </p>
              <h3 className="text-2xl font-black text-[#1a365d]">{totalResponses}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="bg-orange-50 p-4 rounded-2xl"><TrendingUp className="text-orange-500" /></div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                 {user?.role === 'admin' ? "Avg Score" : "Your Average Score"}
              </p>
              <h3 className="text-2xl font-black text-[#1a365d]">{avgScore}%</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="bg-green-50 p-4 rounded-2xl"><CheckCircle className="text-[#10b981]" /></div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
              <h3 className="text-2xl font-black text-green-600">Active</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-black text-[#1a365d]">Detailed Results</h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" placeholder="Search students..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl outline-none text-xs font-bold"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                  <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Quiz</th>
                  <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                  <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResults.map((report) => (
                  <tr key={report._id} className="hover:bg-slate-50/30 transition-all">
                    <td className="p-6 font-bold text-[#1a365d] text-sm">{report.user?.name || 'Anonymous'}</td>
                    <td className="p-6 text-slate-600 font-bold text-xs">{report.quiz?.title || 'General Quiz'}</td>
                    <td className="p-6 text-center">
                      <span className="bg-blue-50 text-[#2563eb] px-4 py-1.5 rounded-xl font-black text-[10px]">
                        {report.score} / {report.totalQuestions}
                      </span>
                    </td>
                    <td className="p-6 text-right text-[10px] font-bold text-slate-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
     {showModal && (
  <CustomModal
    isOpen={showModal}
    title={modalConfig.title}
    message={modalConfig.message}
    type={modalConfig.type}
    onClose={() => setShowModal(false)}
    onConfirm={modalConfig.type === 'warning' ? handleConfirmDelete : null}
  />
)}
    </div>
  );
};

export default Reports;