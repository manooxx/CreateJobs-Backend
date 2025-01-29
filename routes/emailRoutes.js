const express = require('express');
const { sendJobEmails } = require('../controllers/emailController');
const {authenticate} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/send-job-emails/:jobId', authenticate, sendJobEmails);

module.exports = router;
