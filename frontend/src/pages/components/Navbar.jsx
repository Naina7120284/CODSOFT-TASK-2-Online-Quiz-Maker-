import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, ChevronDown, LogOut, Bell, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'My Quizzes', path: '/my-quizzes' },
    { name: 'Reports', path: '/reports' },
    { name: 'Help', path: '/help' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              <ClipboardList className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              Quiz<span className="text-orange-500">Maker</span> 
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 h-full">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`relative text-sm font-semibold transition-colors h-full flex items-center ${
                  location.pathname === link.path ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {!user ? (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-95">
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <button className="text-slate-400 hover:text-slate-600 relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block"></div>

                <div className="relative group flex items-center gap-3 cursor-pointer">
                  <div className="text-right hidden lg:block">
                   <p className="text-sm font-bold text-slate-800 leading-none capitalize">{user?.name || 'Guest'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{user?.role || 'Learner'} </p>
                  </div>
                  
                  <div className="relative">
                    <img 
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 border-blue-50 p-0.5 object-cover"
                       src={`https://ui-avatars.com/api/?name=${user.name}&background=${user.role === 'admin' ? '1e3a8a' : 'ed8936'}&color=fff`}
                      alt="Profile" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <ChevronDown size={12} className="text-slate-400" />
                    </div>
                  </div>

                  <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white border border-slate-100 p-2 rounded-2xl shadow-2xl min-w-[160px]">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 text-sm font-bold py-3 px-4 rounded-xl hover:bg-red-50 w-full transition-colors"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

           <div className="md:hidden flex items-center">
               <button 
                   onClick={() => setIsMenuOpen(!isMenuOpen)} 
                   className="text-slate-600 p-2"
              >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
        </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-50 animate-in slide-in-from-top-2 duration-200">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 text-base font-bold ${
                  location.pathname === link.path ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="flex items-center gap-2 text-red-500 font-bold py-2 w-full text-left"
              >
                <LogOut size={18} /> Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;