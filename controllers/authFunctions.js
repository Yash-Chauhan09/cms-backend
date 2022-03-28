import db from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export function signInUser(req, res) {
  let { email, password } = req.body;
  let token = crypto.randomBytes(1).toString("hex");
  db.execute(`SELECT * FROM users WHERE email = '${email}'`).then(
    async (results) => {
      if (results[0].length > 0) {
        console.log(results[0][0].password);
        let valid = await bcrypt.compare(password, results[0][0].password);
        if (!valid) {
          return res.json({
            error: "INVALID_CREDENTIALS",
          });
        }
        db.execute(
          `UPDATE users SET accessToken = '${token}' WHERE email = '${email}'`
        ).then((data) => {
          res.json({
            userid: results[0][0].userid,
            email: results[0][0].email,
            role: results[0][0].userRole,
            accessToken: token,
          });
        });
      } else {
        res.json({
          error: "INVALID_CREDENTIALS",
        });
      }
    }
  );
}

export function signOutUser(req, res) {
  console.log(req.headers);
  db.execute(
    `UPDATE users SET accessToken = 'null' WHERE accessToken = '${req.headers.accesstoken}'`
  ).then((results) => {
    console.log(results);
    res.json({
      success: "SIGNED_OUT",
    });
  });
}
