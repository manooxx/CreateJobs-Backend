const express = require('express');
const { registerCompany, verifyEmail, loginCompany, getProfile, logout } = require('../controllers/authController');
const {authenticate} = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/register', registerCompany);
router.get('/verify-email/:token', verifyEmail); 
router.post('/login', loginCompany);
router.get('/me', authenticate, getProfile); 
router.post('/logout', logout); 

module.exports = router;
