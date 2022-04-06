import express, { query } from "express";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "./nodemailer.js";
import db from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export function getUsers(req, res) {
  db.execute(`SELECT userid,email,authorized_by,userRole FROM users`).then(
    (results) => {
      console.log(results);
      res.json(results[0]);
    }
  );
}
export async function postUser(req, res) {
  let userid = uuidv4();
  const salt = await bcrypt.genSalt(12);
  let userPassword = await bcrypt.hash(req.body.password, salt);
  let resetToken = crypto.randomBytes(32).toString("hex");

  console.log(salt, userPassword, resetToken);

  db.execute(
    `SELECT userid FROM users WHERE accessToken='${req.headers.accesstoken}'`
  ).then((result) => {
    // console.log(results, results[0], results[0][0].userid);
    let adminId = result[0][0].userid;
    let sql = `INSERT INTO users VALUES ('${userid}','${req.body.email}','${userPassword}','${adminId}','${req.body.userRole}',0,'${resetToken}','null')`;

    db.execute(sql).then((results) => {
      console.log(results);
      let passwordResetLink = `${req.protocol}://${req.get(
        "host"
      )}/reset-password/${resetToken}`;
      console.log(passwordResetLink);
      let user = {
        email: req.body.email,
        password: req.body.password,
        resetLink: passwordResetLink,
      };
      sendMail(user);
      res.send({
        success: "new user added",
      });
    });
  });
}

export async function putUser(req, res) {
  if (req.body.password != req.body.confirmpassword) {
    return res.json({
      error: "passwords do not match!",
    });
  }
  let resetToken = req.params.resetToken;
  const salt = await bcrypt.genSalt(12);
  let userPassword = await bcrypt.hash(req.body.password, salt);
  let sql = `UPDATE users SET password = '${userPassword}', verified = 1, resetPasswordToken = 'null' WHERE resetPasswordToken = '${resetToken}';`;

  db.execute(sql).then((results) => {
    console.log(results);
    res.json({
      success: "password updated",
    });
  });
}
