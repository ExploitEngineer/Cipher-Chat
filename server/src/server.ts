import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.ts";
import session from "express-session";
import passport from "passport";
import { connectDB } from "./config/db-connection.ts";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { CorsOptions } from "cors";
import type { Request, Response, Application, NextFunction } from "express";

dotenv.config();

connectDB();

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
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

app.get("/", (_, res: Response) => {
  res.status(200).json({ msg: "server is running" });
});

app.get("/auth/logout", (req: Request, res: Response, next: NextFunction) => {
  (req as any).logout((err: any) => {
    if (err) return next(err);
    res.redirect("http://localhost:3000");
  });
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
