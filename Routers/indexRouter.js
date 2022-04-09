import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js";
import { getIndex, postIndex } from "../controllers/indexFunctions.js";
import {
  deleteBook,
  getTOC,
  postTOC,
  updateBook,
  postQCremarks,
  getQCremarks,
} from "../controllers/bookFunctions.js";
import {
  checkLoggedIn,
  checkPermission,
} from "../controllers/ProtectHelper.js";
import {
  getNodeInTOC,
  updateTOC,
  deleteTOC,
  getNodeInfo,
} from "../controllers/tocFunctions.js";

const indexRouter = express.Router();

indexRouter
  .route("/")
  .get(checkLoggedIn, checkPermission(["admin", "superuser"]), getIndex)
  .post(checkLoggedIn, checkPermission(["admin", "superuser"]), postIndex);

indexRouter
  .route("/book/:bookid")
  .get(checkLoggedIn, checkPermission(["admin", "superuser"]), getTOC)
  .post(checkLoggedIn, checkPermission(["admin", "superuser"]), postTOC)
  .delete(checkLoggedIn, checkPermission(["admin", "superuser"]), deleteBook)
  .put(checkLoggedIn, checkPermission(["admin", "superuser"]), updateBook);

indexRouter
  .route("/book/:bookid/children/:nodeid")
  .get(checkLoggedIn, checkPermission(["admin", "superuser"]), getNodeInTOC)
  .post(checkLoggedIn, checkPermission(["admin", "superuser"]), postTOC);

indexRouter
  .route("/book/:bookid/node/:nodeid")
  .get(checkLoggedIn, checkPermission(["admin", "superuser"]), getNodeInfo)
  .put(checkLoggedIn, checkPermission(["admin", "superuser"]), updateTOC)
  .delete(checkLoggedIn, checkPermission(["admin", "superuser"]), deleteTOC);

indexRouter
  .route("/book/:bookid/qc/parent/:parentid/node/:nodeid/")
  .post(
    checkLoggedIn,
    checkPermission(["admin", "quality-checker"]),
    postQCremarks
  )
  .get(
    checkLoggedIn,
    checkPermission(["admin", "superuser", "quality-checker"]),
    getQCremarks
  );

export default indexRouter;
