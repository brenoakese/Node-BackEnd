import express from 'express';
import authRoutes from "./routes/authRoutes.js";
import e from 'express';



const app = express(); 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api",authRoutes);

export default app; 