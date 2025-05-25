import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import proproutes from './routes/property.routes.js';
import searchroutes from './routes/search.routes.js';
import reviewroutes from './routes/review.routes.js'
import editroutes from "./routes/edit.routes.js"

dotenv.config({ path: "./.env" });


const app = express();

app.use(cors({
  origin: '.'
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/props",proproutes);
app.use("/api/search",searchroutes);
app.use("/api/review",reviewroutes);
app.use("/api/edit",editroutes);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {  
  console.log('Server is running on port 3000');
});