import mysql from "mysql2";

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "cms",
// });

const db = mysql.createConnection({
  host: "eu-cdbr-west-02.cleardb.net",
  user: "b16d7d2652e82b",
  password: "855f56ef",
  database: "heroku_fed8b901c59a7a1",
});

db.connect((err) => {
  if (err) throw err;
  else {
    console.log("database connected");
  }
});

export default db;
