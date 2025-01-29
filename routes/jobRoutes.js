const express = require('express');
const { createJob, getJobs, getJobById, getJobsByCompany, deleteJob } = require('../controllers/jobController');
const {authenticate} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', authenticate, createJob);
router.get('/alljobs', getJobs);  
router.get('/:id', getJobById); 
router.get('/company/jobs', authenticate,  getJobsByCompany);
router.delete("/company/jobs/:jobId", authenticate, deleteJob);

module.exports = router;
