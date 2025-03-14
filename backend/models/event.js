const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    eventDate: {type: Date, required: true},
    // time: {type: String, required: true},
    urgency: { type: String, required: true },
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    userLocalTime: { type: String, required: true }, 
    comments: [
          {
              user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
              text: String,
              createdAt: { type: Date, default: Date.now },
          },
      ],
},{ timestamps: true })

module.exports = mongoose.model("Event", eventSchema);