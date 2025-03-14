const express = require('express');
const router = express.Router();
const Event = require("../models/event");
const authMiddleware = require("../middleware/authMiddleware");

//create event for authenticate user
router.post("/create", authMiddleware, async (req, res) => {
    console.log("Received Request Body:", req.body);
    console.log("Headers received:", req.headers);

    try {
        const { title, description, urgency, createdBy, location, eventDate, userLocalTime } = req.body;
        console.log("User ID from token:", req.user?._id);
        const newEvent = new Event({
            title, description, urgency, eventDate, createdBy: createdBy || req.user?._id, location, userLocalTime,
        });
        if (!title || !description || !urgency || !location || !eventDate || !userLocalTime) {
            console.error("Validation failed: Missing required fields");
            return res.status(400).json({ error: "All fields are required." });
        }
        console.log("User ID from token:", req.user._id);
        await newEvent.save();
        res.status(201).json({ message: "Event created", event: newEvent });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create event." })
    }
});

//List all events
router.get('/', async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.page, 10) || 1;
        const limitNumber = parseInt(req.query.limit, 10) || 7;
        const skip = (pageNumber - 1) * limitNumber;

        const events = await Event.find().populate("createdBy", "name email").skip(skip).limit(parseInt(limitNumber));

        const totalEvents = await Event.countDocuments();
        const totalPages = Math.ceil(totalEvents / limitNumber);

        res.status(200).json({events, totalPages});
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

//Filter events
router.get("/filter", async (req, res) => {
    try {
        const { urgency, date, location, page = 1,limit = 7 } = req.query;
        const filter = {};

        if (urgency || date || location) {
            filter.$or = [];
            if (urgency) {
                filter.$or.push({ urgency: urgency });
            }
            if (date) {
                filter.$or.push({ eventDate: new Date(date) });
            }
            if (location) {
                filter.$or.push({ location: location });
            }
        }
        const skip = (page -1) * limit;
        const events = await Event.find(filter).sort({ createdAt: -1 }).populate("createdBy", "name email").skip(skip).limit(parseInt(limit));
        const totalEvents = await Event.countDocuments(filter);
        const totalPages = Math.ceil(totalEvents / limit);

        res.status(200).json({events, totalPages});
    }
    catch (error) {
        res.status(500).json({ error: "Failed to filter events" });
    }
});

module.exports = router;