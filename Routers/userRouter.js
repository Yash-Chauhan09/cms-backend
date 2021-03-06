import express, { query } from "express";
import {
  deleteUser,
  getUsers,
  postUser,
  putUser,
} from "../controllers/userFunctions.js";
import {
  checkLoggedIn,
  checkPermission,
} from "../controllers/ProtectHelper.js";
const userRouter = express.Router();

userRouter
  .route("/")
  .get(checkLoggedIn, checkPermission(["admin", "superuser"]), getUsers)
  .post(checkLoggedIn, checkPermission(["admin"]), postUser);

userRouter
  .route("/:userid")
  .delete(checkLoggedIn, checkPermission(["admin"]), deleteUser);

userRouter.route("/reset-password/:resetToken").put(putUser);

export default userRouter;
