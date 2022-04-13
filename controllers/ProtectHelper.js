import db from "../config/db.js";

export function checkLoggedIn(req, res, next) {
  db.execute(
    `SELECT * from users WHERE accessToken = '${req.headers.accesstoken}'`
  ).then((results) => {
    if (results.length == 0) {
      return res.json({
        error: "ACCESS_DENIED",
        type: "AUTHORIZATION",
      });
    } else {
      if (results[0][0].verified == 0) {
        return res.json({
          error: "user not verified",
          message: "please reset your password to verify your account",
        });
      } else {
        next();
      }
    }
  });
}

export function checkPermission(allowedUsers) {
  return (req, res, next) => {
    db.execute(
      `SELECT userRole FROM users WHERE accessToken='${req.headers.accesstoken}'`
    ).then((results) => {
      console.log(results);
      if (allowedUsers.includes(results[0][0].userRole)) {
        console.log(results);
        next();
      } else {
        res.json({
          error: "PERMISSION NOT ALLOWED",
        });
      }
    });
  };
}
