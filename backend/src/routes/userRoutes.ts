import { Router } from "express";
import { getAllUsers, userLogout, userSignin, userSignup, verifyUser } from "../controllers/userController";
import { loginValidator, signupValidator, validate } from "../utils/validators";
import { verifyToken } from "../auth/token-manager";

const userRoutes = Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userSignin);
userRoutes.get("/auth-status",verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);

export default userRoutes