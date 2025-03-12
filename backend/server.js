require("dotenv").config();

const express = require('express');
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const helpRoutes = require("./routes/helpRoutes");
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/events",eventRoutes);
app.use("/api/helpRequests", helpRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () =>  console.log(`Server running on ${PORT}`));