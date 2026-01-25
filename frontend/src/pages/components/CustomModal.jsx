import React from 'react';
import {X, AlertCircle, CheckCircle2, Trash2} from 'lucide-react';
const CustomModal = ({ isOpen, onClose, onConfirm, title, message, type}) => {
  if (!isOpen) return null;

 const handleAction = () => {
    if (onConfirm) {
      console.log("onConfirm found! Executing action...");
      onConfirm(); 
    }
    onClose(); 
  };

 return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-blue-50 animate-in slide-in-from-top-10 duration-500">
        
        <div className="flex justify-center mb-6">
          <div className={`${type === 'warning' ? 'bg-red-50' : 'bg-blue-50'} p-4 rounded-full`}>
            <div className={`w-12 h-12 ${type === 'warning' ? 'bg-red-600' : 'bg-blue-600'} rounded-full flex items-center justify-center shadow-lg`}>
              {type === 'warning' ? (
                <Trash2 className="w-6 h-6 text-white" />
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-[#1a365d] mb-3">{title}</h2>
          <p className="text-slate-500 font-bold leading-relaxed mb-8">{message}</p>
        </div>

       {type === 'warning' ? (
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleAction} 
              className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
            >
              Delete All
            </button>
          </div>
        ) : (
          <button 
            onClick={onClose} 
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            Okay
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomModal;