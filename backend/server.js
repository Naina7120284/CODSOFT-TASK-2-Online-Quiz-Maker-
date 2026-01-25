const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const resultRoutes = require('./src/routes/resultRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const morgan = require('morgan');

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); 
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://quiz-makerapp.netlify.app'],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/quizzes', quizRoutes);
app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.send('QuizMaker API is running...');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));