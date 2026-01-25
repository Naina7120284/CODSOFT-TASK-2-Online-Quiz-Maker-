import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateQuiz from './pages/CreateQuiz';
import ProtectedRoute from './pages/components/ProtectedRoute';
import Register from './pages/Register';
import TakeQuiz from './pages/TakeQuiz';
import EditQuiz from './pages/EditQuiz';
import MyQuizzes from './pages/MyQuizzes';
import Reports from './pages/Reports';
import Help from './pages/Help';

function App() {
  
  const user = JSON.parse(localStorage.getItem('user'));

  return (
     <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-quizzes" element={<MyQuizzes />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/help" element={<Help />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />

        <Route path="/edit/:id" element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <EditQuiz /> : <Navigate to="/" />}
          </ProtectedRoute>
        } />
        <Route path="/take-quiz/:id" element={<TakeQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;