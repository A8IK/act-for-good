const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const HelpRequest = require("../models/helpRequest");

// Comment on help request
router.post("/comment/:requestId", authMiddleware, async (req, res) => {
    try {

        console.log("Request received for:", req.params.requestId); 

        const helpRequest = await HelpRequest.findById(req.params.requestId);
        if (!helpRequest) {
            return res.status(404).json({ error: "Request not found" })
        };

        helpRequest.comments.push({ user: req.user.id, text: req.body.text });
        await helpRequest.save();
        res.status(200).json({ message: "Comment added" });
    } 
    catch (error) {
        res.status(500).json({ error: "Failed to add comment" });
    }
});

// Mark as urgent
router.patch("/urgent/:requestId", authMiddleware, async (req, res) => {
    try {
        const helpRequest = await HelpRequest.findById(req.params.requestId);
        if (!helpRequest) {
            return res.status(404).json({ error: "Request not found" })
        };

        helpRequest.isUrgent = true;
        await helpRequest.save();
        res.status(200).json({ message: "Request marked" });
    } 
    catch (error) {
        res.status(500).json({ error: "Failed to mark" });
    }
});

module.exports = router;
