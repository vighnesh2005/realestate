import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import proproutes from './routes/property.routes.js';
import searchroutes from './routes/search.routes.js';
import reviewroutes from './routes/review.routes.js'
import editroutes from "./routes/edit.routes.js"
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: "./.env" });


const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/props",proproutes);
app.use("/api/search",searchroutes);
app.use("/api/review",reviewroutes);
app.use("/api/edit",editroutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

app.post("/delete-image", async (req, res) => {
  const { public_id } = req.body;

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.json({ success: true, result });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

app.get("/",(req,res)=>{
  res.send("hello");
})
app.listen(3000, () => {  
  console.log('Server is running on port 3000');
});