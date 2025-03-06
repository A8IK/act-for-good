const express = require("express");
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
const router = express.Router();
require("dotenv").config();

//SignUp
router.post("/signup", async(req, res) => {
    const {name, email, password, contact, supportType} = req.body;
    const hashPassword = await bycrypt.hash(password, 11);

    try{
        const user = await User.create({name, email, password: hashPassword, contact, supportType});
        res.status(201).json({message: "User created",user});
    }
    catch(error){
        res.status(500).json({error: 'Registration failed'})
    }
});

//Login
router.post("/login", async (req, res) => {
    const {email, password } = req.body;
    try{
        const user = await User.findOne({where: {email}});
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({error: "Invaild credintials"});
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expressIn: "1d"});
        res.json({message: "Login successful", token});
    }
    catch (error){
        res.status(500).json({error:"Login failed"});
    }
});

module.exports = router;