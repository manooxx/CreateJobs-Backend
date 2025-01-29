const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({

    name: {
            type: String,
            required: true 
        },
    email:
    { 
        type: String,
        required: true,
        unique: true 
    },
    password:
    { 
        type: String, 
        required: true 
    },
    phone: 
    { 
        type: String, 
        required: true 
    },
    isVerified: 
    { 
        type: Boolean, 
        default: false 
    },
});

module.exports = mongoose.model('Company', companySchema);
