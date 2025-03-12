const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Event = require("../models/event");

//Add comment
router.post("/comment/:eventId", authMiddleware, async (req, res) => {
    try {
        const { eventId } = req.params;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const newComment = {
            user: req.user._id,
            text: comment,
            createdAt: new Date(),
        };

        await Event.updateOne(
            { _id: eventId },
            { $push: { comments: newComment } }
        );

        const updatedEvent = await Event.findById(eventId).populate('comments.user', 'name');

        const addedComment = updatedEvent.comments.find(
            (c) => c.text === comment && c.user._id.toString() === req.user._id.toString()
        );

        res.status(200).json({ message: "Comment added successfully", comment: addedComment });
    }
    catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//fetch comment
router.get("/comments/:eventId", authMiddleware, async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId).populate('comments.user', 'name');

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event.comments);
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
