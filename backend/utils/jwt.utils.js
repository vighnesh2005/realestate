import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: "../.env" });


export const generateToken = async (user,res)=>{
    const token = jwt.sign(user,process.env.JWT_SECRET,{
        expiresIn: '7d',
    });
    res.cookie('jwt',token,{
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

export const checkToken = async (req,res,next)=>{
    const token = req.cookies.jwt;

    if(!token)
        return res.status(400).json({message:"jwt cookie not found"});
    
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();        
    } catch (error) {
        console.log("Error verifying the cookie");
        return res.status(400).json({message:"Internal server error"});
    }

}
