const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, deleteJob } = require('../controllers/jobController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
    .get(getJobs)
    .post(protect, adminOnly, createJob);

router.route('/:id')
    .get(getJobById)
    .delete(protect, adminOnly, deleteJob);

module.exports = router;
