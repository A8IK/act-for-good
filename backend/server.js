const express = require('express');
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>  console.log(`Server running on ${PORT}`));