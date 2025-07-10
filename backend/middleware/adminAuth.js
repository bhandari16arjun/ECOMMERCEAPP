import jwt from 'jsonwebtoken';

const adminAuth=(req,res,next)=>{
    
    try{
        const authHeader = req.headers.authorization;
         if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Not Authorized: No token provided or malformed header." });
        }
        const token = authHeader.split(' ')[1];
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
         if (decodedPayload.role !== 'admin') 
            return res.status(403).json({ success: false, message: "Forbidden: User is not an admin." })
        next();

    } catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }

}

export default adminAuth;