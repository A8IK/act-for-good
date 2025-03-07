const express = require('express');
const router = express.Router();
const Event = require("../models/event");
const authRoutes = require("../middleware/authMiddleware");

//create event for authenticate user
router.post("/create", authRoutes, async (req, res) => {
    try{
        const {title, description, location, date, time, category} = req.body;
        const newEvent = new Event({
            title, description, location, date, time, category, createdBy: req.user.id
        });
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
        const events = await Event.find().populate("creatBy", "name email");
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