const express = require('express');
const router = express.Router();
const { applyForJob, getUserApplications, getAllApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
    .get(protect, adminOnly, getAllApplications)
    .post(protect, upload.single('resume'), applyForJob);

router.route('/myapplications')
    .get(protect, getUserApplications);

router.route('/:id/status')
    .put(protect, adminOnly, updateApplicationStatus);

module.exports = router;
