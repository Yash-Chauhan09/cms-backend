import db from "../config/db.js";

export function checkLoggedIn(req, res, next) {
  let sql = `SELECT * from users WHERE accessToken = '${req.headers.accesstoken}'`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({
        error: err.code,
      });
    }
    if (result.length == 0) {
      return res.json({
        error: "ACCESS_DENIED",
        type: "AUTHORIZATION",
      });
    }
    next();
  });
}

export function checkPermission(allowedUsers) {
  return (req, res, next) => {
    let sql = `SELECT userRole FROM users WHERE userid='${req.session.userid}'`;
    db.query(sql, (err, results) => {
      if (err) {
        res.json({
          error: err.code,
        });
        return;
      }
      if (allowedUsers.includes(results[0].userRole)) {
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
