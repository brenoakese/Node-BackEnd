import express from 'express';
import authRoutes from "./routes/authRoutes.js";
import cors from 'cors';



const app = express(); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api",authRoutes);

export default app; 