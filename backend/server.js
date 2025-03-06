require("dotenv").config();

const express = require('express');
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () =>  console.log(`Server running on ${PORT}`));