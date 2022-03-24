import express from "express";
import { signInUser, signOutUser } from "../controllers/authFunctions.js";
import { checkLoggedIn } from "../controllers/ProtectHelper.js";
const authRouter = express.Router();

authRouter.route("/signin").post(signInUser);
authRouter.route("/signout").get(checkLoggedIn, signOutUser);

export default authRouter;
