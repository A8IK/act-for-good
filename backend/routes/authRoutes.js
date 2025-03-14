const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
require("dotenv").config();

//SignUp
router.post("/signup", async (req, res) => {

    try {
        const { name, email, password, contact, supportType } = req.body;

        console.log("Received signup request:", req.body);

        const hashPassword = await bcrypt.hash(password, 11);
        const existingUser = await User.findOne({ email });

        if (!name || !email || !password || !contact || !supportType) {
            console.log("Missing fields:", req.body);
            return res.status(400).json({ error: "All fields are required" });
        }

        if (existingUser) {
            return res.status(400).json({ error: "User already exists." })
        }
        const newuser = new User({ name, email, password: hashPassword, contact, supportType });
        const savedUser = await newuser.save();
        res.status(201).json({ message: "User created", savedUser });
    }
    catch (error) {
        res.status(500).json({ error: 'Registration failed' })
    }
});

//Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Email not registered" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ message: "Login successful", token });
    }
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;