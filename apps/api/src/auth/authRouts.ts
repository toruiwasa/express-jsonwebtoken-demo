import rateLimit from "express-rate-limit";
import { login, logout, me, refreshtoken, signup } from "./authController";
import { Router } from "express";

const authRoutes: Router = Router();

const rateLimitter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again later.",
});

authRoutes.use(rateLimitter);

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/me", me);
authRoutes.post("/logout", logout);
authRoutes.post("/refresh_token", refreshtoken);

export { authRoutes };
