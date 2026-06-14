import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
dotenv.config();
// const express=require("express");

const app = express();
const port= process.env.PORT || 5001;


app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.json());
app.use(rateLimiter); // Apply rate limiter middleware to all routes


app.use("/api/notes", notesRoutes);
connectDB().then(() =>{
    app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
});



//mongodb+srv://Pranay14:Ppranay14@cluster0.ebx4kp1.mongodb.net/?appName=Cluster0