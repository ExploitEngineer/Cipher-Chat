import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.ts";
import usersRoutes from "./routes/user.route.ts";
import messageRoutes from "./routes/message.route.ts";
import session from "express-session";
import passport from "passport";
import { connectDB } from "./config/db-connection.ts";
import { app, server } from "./lib/socket.ts";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { CorsOptions } from "cors";
import type { Response } from "express";

dotenv.config();

connectDB();

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
if (process.env.SESSION_SECRET) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    }),
  );
}
app.use(passport.initialize());
app.use(passport.session());
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      },
    ),
  );
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user!));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (_, res: Response) => {
  res.status(200).json({ message: "server is running" });
});

const PORT = process.env.PORT || 4001;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
