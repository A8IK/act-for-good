const express = require("express");
const bycrypt = require(bcryptjs);
const jwt = require('jsonwebtoken');
const {user} = require('../models');
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