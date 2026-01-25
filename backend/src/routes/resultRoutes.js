const express = require('express');
const router = express.Router();    
const { protect, admin } = require('../middleware/authMiddleware'); 
const { 
  saveResult, 
  getMyResults, 
  getAllResults, 
  clearAllResults 
} = require('../controllers/resultController');

router.get('/', protect, getAllResults); 
router.post('/', protect, saveResult);
router.get('/my-results', protect, getMyResults);
router.delete('/clear-all', protect, admin, clearAllResults);

module.exports = router;