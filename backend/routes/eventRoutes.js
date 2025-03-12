const express = require('express');
const router = express.Router();
const Event = require("../models/event");
const authMiddleware = require("../middleware/authMiddleware");

//create event for authenticate user
router.post("/create", authMiddleware, async (req, res) => {
    console.log("Received Request Body:", req.body);
    console.log("Headers received:", req.headers); 

    try{
        const {title, description, urgency, createdBy, location, userLocalTime} = req.body;
        const newEvent = new Event({
            title, description,urgency, createdBy: createdBy || req.user._id, location, userLocalTime,
        });
        if (!title || !description || !urgency || !location || !userLocalTime) {
            console.error("Validation failed: Missing required fields");
            return res.status(400).json({ error: "All fields are required." });
        }
        console.log("User ID from token:", req.user._id);
        await newEvent.save();
        res.status(201).json({message: "Event created", event: newEvent });
    }
    catch (error){
        res.status(500).json({error: "Failed to create event."})
    }
});

//List all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate("createdBy", "name email");
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({error: "Failed to fetch events"});
    }
});

//Filter events
router.get("/filter", async (req, res) => {
    try {
        const { category, date, location } = req.query;
        const filter = {};
        if (category) {
            filter.category = category
        };
        if (date) {
            filter.date = new Date(date)
        };
        if (location) {
            filter.location = location
        };

        const events = await Event.find(filter);
        res.status(200).json(events);
    } 
    catch (error) {
        res.status(500).json({ error: "Failed to filter events" });
    }
});

module.exports = router;