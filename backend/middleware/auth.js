import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    // 1. Get the authorization header from the request
    const authHeader = req.headers.authorization;

    // 2. Check if the header exists and is in the correct format ('Bearer <token>')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Not Authorized, token is missing or invalid." });
    }

    try {
        // 3. Extract the token from the header
        const token = authHeader.split(' ')[1];

        // 4. Verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Attach the user's ID (which is the document _id) to the request body
        req.body.userId = token_decode.id;
        
        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.log("Auth Middleware Error:", error);
        res.status(401).json({ success: false, message: "Authorization failed, please login again." });
    }
}

export default authUser;