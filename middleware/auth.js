const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
    try{
        // Grab token
        const token = req.header('Authorization').split(' ')[1];
        // Verify token
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!decodedToken) {
            return;
        }
        req.password = decodedToken;
        next();
    } catch(err) {
        res.status(400).json({"Error": "Please Authenticate"})
    }
}
module.exports = authenticate; 