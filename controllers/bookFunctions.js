import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js";
import { removeHyphens } from "./removeHyphens.js";

export function deleteBook(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  console.log(bookId);
  let sql1 = `DROP TABLE ${bookId}`;
  db.query(sql1, (err, result) => {
    if (err) {
      res.json({
        error: err.code,
      });
      return;
    }
    console.log(result);
  });
  let sql2 = `DELETE FROM books WHERE bookid = '${req.params.bookid}'`;
  db.query(sql2, (err, result) => {
    if (err) {
      res.json({
        error: err.code,
      });
      return;
    }
    console.log(result);
    res.json({
      success: "book deleted",
    });
  });
}
export function postTOC(req, res) {
  let bookId = req.body.bookid;
  let bookTable = removeHyphens(bookId);
  let uuid = uuidv4();
  console.log(uuid);
  let addNode = `INSERT INTO ${bookTable} VALUES('${uuid}','${req.body.type}','${req.body.parentid}','${req.body.bookid}','${req.body.name}','${req.body.page}','${req.body.question}','${req.body.answer}','null')`;
  db.query(addNode, (err, result) => {
    if (err) {
      res.json({
        error: err.code,
      });
      return;
    }
    console.log(result);
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
  db.query(sql, (err, results) => {
    if (err) {
      res.json({
        error: err.code,
      });
      return;
    }
    console.log(results);
    res.json(results);
  });
}

export function postQCremarks(req, res) {
  let uuid = uuidv4();
  let sql = `INSERT INTO quality_checking VALUES('${uuid}','${req.params.nodeid}','${req.params.parentid}','${req.params.bookid}','${req.session.userid}',now(),'${req.body.status}','${req.body.errors}','${req.body.remarks}')`;
  db.query(sql, (err, results) => {
    if (err) {
      res.json({
        error: err.code,
      });
      return;
    }
    console.log(results);
    res.json({
      success: "quality checker remark added",
    });
  });
}
export function getQCremarks(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  let obj = {};
  let sql = `SELECT * FROM ${bookId} WHERE nodeid='${req.params.nodeid}'`;
  db.query(sql, (err, results) => {
    if (err) {
      res.json({
        error: err.code,
      });
      return;
    }
    console.log(results);
    obj.node_info = results[0];
  });
  let sql2 = `SELECT * FROM quality_checking WHERE node_id='${req.params.nodeid}'`;
  db.query(sql2, (err, results) => {
    if (err) {
      console.log(err);
      res.json({
        error: err.code,
      });
      return;
    }
    console.log(results);
    obj.remarks_info = results;
    res.json(obj);
  });
}
