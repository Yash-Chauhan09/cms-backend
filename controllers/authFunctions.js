import db from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export function signInUser(req, res) {
  let { email, password } = req.body;
  let findUser = `SELECT * FROM users WHERE email = '${email}'`;
  db.query(findUser, async (err, result) => {
    if (err) {
      console.log(err);
      res.json({
        error: err.code,
      });
      return;
    } else {
      if (result.length == 0) {
        res.json({
          error: "INVALID_CREDENTIALS",
          type: "AUTHORIZATION",
        });
      } else {
        let valid = await bcrypt.compare(password, result[0].password);
        if (!valid) {
          res.json({
            error: "INVALID_CREDENTIALS",
            type: "AUTHORIZATION",
          });
        }
        if (result[0].verified == 0) {
          res.json({
            error: "ACCOUNT NOT VERIFIED",
            message:
              "Please reset your password from the link provided in mail to verify your account",
          });
        }
        req.session.userid = result[0].userid;
        let token = crypto.randomBytes(128).toString("hex");
        let sql = `UPDATE users SET accessToken = '${token}' WHERE userid='${result[0].userid}';`;
        db.query(sql, (err2, result2) => {
          if (err2) {
            return res.json({
              error: err2.code,
            });
          }
          res.json({
            userid: result[0].userid,
            email: result[0].email,
            role: result[0].userRole,
            accessToken: token,
          });
        });
      }
    }
  });
}

export function signOutUser(req, res) {
  let sql = `UPDATE users SET accessToken = 'null' WHERE userid='${req.session.userid}';`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({
        error: err.code,
      });
    }
    req.session.destroy();
    res.json({
      success: "SIGNED_OUT",
    });
  });
}
