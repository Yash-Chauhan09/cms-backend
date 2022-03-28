import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js";
import { removeHyphens } from "./removeHyphens.js";

export function deleteBook(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  console.log(bookId);
  db.execute(`DROP TABLE ${bookId}`).then((results) => {
    console.log(results);
  });
  db.execute(`DELETE FROM books WHERE bookid = '${req.params.bookid}'`).then(
    (results) => {
      console.log(results);
      res.json({
        success: "book deleted",
      });
    }
  );
}
export function postTOC(req, res) {
  let bookId = req.body.bookid;
  let bookTable = removeHyphens(bookId);
  let uuid = uuidv4();
  console.log(uuid);
  let addNode = `INSERT INTO ${bookTable} VALUES('${uuid}','${req.body.type}','${req.body.parentid}','${req.body.bookid}','${req.body.name}','${req.body.page}','${req.body.question}','${req.body.answer}','null')`;

  db.execute(
    `INSERT INTO ${bookTable} VALUES('${uuid}','${req.body.type}','${req.body.parentid}','${req.body.bookid}','${req.body.name}','${req.body.page}','${req.body.question}','${req.body.answer}')`
  ).then((results) => {
    console.log(results);
    res.json({
      success: "new node added in TOC",
    });
  });
}
export function getTOC(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  let sql;
  console.log(req.query);
  if (req.query.withProgress == "true") {
    sql = `SELECT * FROM ${bookId} WHERE type = 'chapter'`;
  } else {
    sql = `SELECT nodeid, type, parentid, bookid, name, page FROM ${bookId} WHERE type = 'chapter' `;
  }

  db.execute(sql).then((results) => {
    console.log(results);
    res.json(results[0]);
  });
}

export function postQCremarks(req, res) {
  let uuid = uuidv4();

  db.execute(
    `SELECT userid FROM users WHERE accessToken='${req.headers.accesstoken}'`
  ).then((results) => {
    // console.log(results, results[0], results[0][0].userid);
    let userid = results[0][0].userid;
    let sql = `INSERT INTO quality_checking VALUES('${uuid}','${req.params.nodeid}','${req.params.parentid}','${req.params.bookid}','${userid}',now(),'${req.body.status}','${req.body.errors}','${req.body.remarks}')`;

    db.execute(sql)
      .then((result) => {
        console.log(result);
        res.json({
          success: "quality checker remark added",
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          error: err.code,
        });
      });
  });
}

export function getQCremarks(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  let obj = {};
  let sql = `SELECT * FROM ${bookId} WHERE nodeid='${req.params.nodeid}'`;

  db.execute(sql).then((results) => {
    console.log(results, results[0], results[0][0]);
    obj.node_info = results[0][0];
  });

  let sql2 = `SELECT * FROM quality_checking WHERE node_id='${req.params.nodeid}'`;

  db.execute(sql2).then((results) => {
    console.log(results);
    obj.remarks_info = results[0];
    res.json(obj);
  });
}
