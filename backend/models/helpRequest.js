const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    isUrgent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("HelpRequest", helpRequestSchema);
