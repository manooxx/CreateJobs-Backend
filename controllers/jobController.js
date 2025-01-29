const Job = require('../models/Job');
const mongoose = require("mongoose");

const createJob = async (req, res) => {
    try {
        const { title, description, experienceLevel, candidates, endDate } = req.body;
        if (!title || !description || !experienceLevel || !endDate) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const job = new Job({
            companyId: req.user.id, 
            title,
            description,
            experienceLevel,
            candidates,
            endDate
        });

        await job.save();
        res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('companyId', 'name email'); 
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('companyId', 'name email'); 
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const getJobsByCompany = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        // console.log("Decoded Token User ID:", req.user.id); // Debugging

        const companyId = req.user.id;

        // Check if companyId is valid
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid company ID" });
        }

        const jobs = await Job.find({ companyId: new mongoose.Types.ObjectId(companyId) })
            .populate("companyId", "name email");

        // if (jobs.length === 0) {
        //     return res.status(201).json({ message: "No jobs found for this company" });
        // }

        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteJob = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const companyId = req.user.id;
        const { jobId } = req.params;

        // Check if jobId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid job ID" });
        }

        // Find the job and check if it belongs to the logged-in company
        const job = await Job.findOne({ _id: jobId, companyId });

        if (!job) {
            return res.status(404).json({ message: "Job not found or you don't have permission to delete this job" });
        }

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Server error", error });
    }
};



module.exports = {createJob, getJobs, getJobById, getJobsByCompany, deleteJob}