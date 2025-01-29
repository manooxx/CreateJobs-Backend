const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true 
    },
    title: 
    { 
        type: String, 
        required: true 
    },
    description: 
    { 
        type: String, 
        required: true 
    },
    experienceLevel: 
    { 
        type: String, 
        enum: ['BEGINNER', 'INTERMEDIATE', 'EXPERT'], 
        required: true 
    },
    candidates: 
    [
        { 
            type: String 
        }
    ],
    endDate: 
    { 
        type: Date, 
        required: true 
    },
});

module.exports = mongoose.model('Job', jobSchema);
