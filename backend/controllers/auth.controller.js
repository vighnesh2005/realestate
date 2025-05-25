import db from "../db/db.js";
import bcrypt from 'bcrypt';
import {generateToken} from "../utils/jwt.utils.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(email === "" || password === "") {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const user = await db.query("SELECT * FROM users WHERE email = $1",[email]);

        if(user.rows.length === 0){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const check = await bcrypt.compare(password,user.rows[0].password);
        if(!check){
            return res.status(400).json({message:"Invalid credentials"});
        }
        
        generateToken(user.rows[0],res);
        req.user = user;
        return res.status(200).json({ message: "Login successful", userid: user.rows[0].id });

    } catch (error) {
        console.error("Error occured at login :",error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const signup = async (req, res) => {
    const {username,email,password,phoneno} = req.body;
    try {
        if(username === "" || email === "" || password === "") {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.query(
            "INSERT INTO users (username, email, password, phoneno) VALUES ($1, $2, $3, $4) RETURNING *",
            [username, email, hashedPassword, phoneno]
        );

        if (newUser.rows.length > 0) {
            generateToken(newUser.rows[0],res);
            req.user = newUser;
            return res.status(201).json({ message: "User created successfully" , userid:newUser.rows[0].id});
        } else {
            return res.status(400).json({ message: "User not created" });
        }
        
    } catch (error) {
        console.error("Error occured at signup :",error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    return res.status(200).json({message : "logout successfull"});
}  