const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const generateToken = require('../config/jwt');
const sendEmail = require('../config/email');

const registerCompany = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const company = await Company.create({ name, email, password: hashedPassword, phone });

        const token = generateToken(company._id);
        const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000"; // Use frontend URL
        const verificationLink = `${frontendURL}verify-email/${token}`;

        const emailContent = `
            <h2>Email Verification</h2>
            <p>Click the link below to verify your email:</p>
            <a href="${verificationLink}" target="_blank" rel="noopener noreferrer" style="padding:10px 20px; background:#28a745; color:white; text-decoration:none; border-radius:5px;">Verify Email</a>
            <p>If you cannot click the link, copy and paste this URL into your browser:</p>
            <p>${verificationLink}</p>
        `;

        await sendEmail(email, "Verify Your Account", emailContent);

        res.status(201).json({ message: "Registered successfully, check email for verification" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const company = await Company.findById(decoded.id);

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        if (company.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        company.isVerified = true;
        await company.save();

        res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};

const loginCompany = async (req, res) => {
    const { email, password } = req.body;
    try {
        const company = await Company.findOne({ email });
        if (!company) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = generateToken(company._id);
        res.cookie("token", token, { httpOnly: true }).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getProfile = async (req, res) => {
    try {
        const company = await Company.findById(req.user.id).select("-password");
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error during logout", error: error.message });
    }
};

module.exports = { 
    registerCompany, 
    verifyEmail, 
    loginCompany, 
    getProfile, 
    logout 
};
