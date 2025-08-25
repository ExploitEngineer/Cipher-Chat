import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import type { CorsOptions } from "cors";
import type { Response, Application } from "express";

dotenv.config();

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.get("/", (_, res: Response) => {
  res.status(200).json({ msg: "server is running" });
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
