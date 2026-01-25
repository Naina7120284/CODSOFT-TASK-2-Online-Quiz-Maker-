import axios from 'axios';
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });


API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const fetchQuizzes = () => API.get('/quizzes');
export const createQuiz = (quizData) => API.post('/quizzes', quizData);