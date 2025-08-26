import passport from "passport";

export const authenticateGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account"
});

export const authenticateGoogleCallback = passport.authenticate("google", {
  failureRedirect: "/",
});
