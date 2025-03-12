const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Authorization Header:", authHeader); //Debugging

    const token = authHeader?.split(" ")[1];
    console.log("Extracted Token:", token);
    if(!token) {
        console.error("No token provided"); 
        return res.status(401).json({error: "Access denied, no token provided"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        req.user = {_id: decoded.id};
        next();
    }
    catch(error){
        console.error("Token verification failed:", error);
        res.status(401).json({error: "Invalid token"})
    }
};
module.exports = authMiddleware;