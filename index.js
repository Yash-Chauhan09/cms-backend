import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import cors from "cors";
import express from "express";
import userRouter from "./Routers/userRouter.js";
import authRouter from "./Routers/authRouter.js";
import indexRouter from "./Routers/indexRouter.js";
import multer from "multer";
import cloudinary from "./config/cloudinary.js";
import { storage } from "./config/cloudinary.js";

const upload = multer({ storage });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://freecoedu-cms.herokuapp.com",
      "https://freecoedu-cms-frontend.herokuapp.com",
    ],
    allowedHeaders: "*",
  })
);

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/index", indexRouter);

app.post("/uploadimage", async (req, res) => {
  try {
    let result = await cloudinary.uploader.upload(req.body.image);
    console.log(result);
    res.json({
      success: "image uploaded",
      url: result.secure_url,
    });
  } catch (err) {
    console.log(err);
    res.json({
      error: err,
    });
  }
});
app.post("/uploadpdf", async (req, res) => {
  let result = await cloudinary.uploader.upload(req.body.pdf);
  try {
    console.log(result);
    res.json({
      success: "pdf uploaded",
      url: result.secure_url,
    });
  } catch (err) {
    console.log(err);
    res.json({
      error: err,
    });
  }
});
app.post("/uploadvideo", async (req, res) => {
  try {
    console.log(req.file);
    let result = await cloudinary.uploader.upload(req.file, {
      resource_type: "video",
    });
    console.log(result);
    res.json({
      success: "video uploaded",
      url: result.secure_url,
    });
  } catch (err) {
    console.log(err);
    res.json({
      error: err,
    });
  }
});
// app.post("/uploadvideo", upload.single("video"), (req, res) => {
//   console.log(req.file);
//   res.json({
//     success: "video uploaded",
//   });
// });

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
