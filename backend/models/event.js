const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    // location: {type: String, required: true},
    // date: {type: Date, required: true},
    // time: {type: String, required: true},
    urgency: { type: String, required: true },
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
},{ timestamps: true })

module.exports = mongoose.model("Event", eventSchema);