import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./db";
import userRoutes from "./userRoutes";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Маршрути
app.use("/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
