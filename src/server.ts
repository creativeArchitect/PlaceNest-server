import express from "express";
import cors from "cors";  
import dotenv from "dotenv";
import morgan from "morgan";
import type { Request, Response, NextFunction } from "express";
import helmet from "helmet";

const app = express();
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));


app.get("/ping", (req: Request, res: Response, next: NextFunction) => {
  res.send("PONG...");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Server is running on the PORT: " + port);
  });