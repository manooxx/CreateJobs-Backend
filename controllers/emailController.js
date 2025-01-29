const Job = require('../models/Job');
const EmailLog = require('../models/EmailLog');
const sendEmail = require('../config/email');

exports.sendJobEmails = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId).populate('companyId');

        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.companyId._id.toString() !== req.user.id)
            return res.status(403).json({ message: "Unauthorized to send emails for this job" });

        for (const email of job.candidates) {
            await sendEmail(
                email,
                `New Job Opportunity: ${job.title}`,
                `Hello,\n\n${job.companyId.name} has posted a new job: ${job.title}.\nDescription: ${job.description}\nExperience Level: ${job.experienceLevel}\nApply before: ${job.endDate}\n\nBest,\nJob Board`
            );

            
            await EmailLog.create({ jobId: job._id, recipientEmail: email });
        }

        res.status(200).json({ message: "Emails sent successfully" });
    } catch (error) {
        console.error("Error sending job emails:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
