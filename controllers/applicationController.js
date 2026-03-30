const Application = require('../models/Application');
const Job = require('../models/Job');

exports.applyForJob = async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;
        const resumePath = req.file ? req.file.path : null;

        if (!resumePath) {
            return res.status(400).json({ message: 'Resume is required' });
        }

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const application = new Application({
            job: jobId,
            applicant: req.user.id,
            resumePath,
            coverLetter
        });

        await application.save();
        res.status(201).json(application);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getUserApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id }).populate('job', 'title company');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().populate('job', 'title company').populate('applicant', 'name email');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = req.body.status || application.status;
        await application.save();
        res.json(application);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
