import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js";
import { removeHyphens } from "./removeHyphens.js";

export function deleteTOC(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  let nodeId = req.params.nodeid;
  let sql = `DELETE FROM ${bookId} WHERE nodeid = '${nodeId}'`;
  console.log(bookId, nodeId, sql);

  db.query(sql).then((results) => {
    console.log(results);
    res.json({
      success: "node deleted from given TOC",
    });
  });
}
export function updateTOC(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  let nodeId = req.params.nodeid;
  let sql = `UPDATE ${bookId} SET type = '${req.body.type}',parentid = '${req.body.parentid}',bookid = '${req.body.bookid}', name = '${req.body.name}',page = '${req.body.page}' WHERE nodeid = '${nodeId}'`;
  console.log(bookId, nodeId, sql);

  db.execute(sql).then((results) => {
    console.log(results);
    res.json({
      success: "node updated in given TOC",
    });
  });
}

export function getNodeInTOC(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  let nodeId = req.params.nodeid;
  let sql;
  if (req.query.withProgress == "true") {
    sql = `SELECT * FROM ${bookId} WHERE parentid='${nodeId}'`;
  } else {
    sql = `SELECT nodeid, type, parentid, bookid, name, page FROM ${bookId} WHERE parentid='${nodeId}' `;
  }
  console.log(bookId, nodeId, sql);

  db.execute(sql).then((results) => {
    console.log(results);
    res.json(results[0]);
  });
}
export function getNodeInfo(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  let nodeId = req.params.nodeid;
  let sql = `SELECT * FROM ${bookId} WHERE nodeid='${nodeId}'`;

  console.log(bookId, nodeId, sql);

  db.execute(sql).then((results) => {
    console.log(results);
    res.json(results[0][0]);
  });
}

export function updateAnswer(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  let nodeId = req.params.nodeid;
  let sql = `UPDATE ${bookId} SET answer = '${req.body.answer}' WHERE nodeid = '${nodeId}'`;
  console.log(bookId, nodeId, sql);

  db.execute(sql).then((results) => {
    console.log(results);
    res.json({
      success: "answer updated",
    });
  });
}
export function updateQuestion(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  let nodeId = req.params.nodeid;
  let sql = `UPDATE ${bookId} SET question = '${req.body.question}' WHERE nodeid = '${nodeId}'`;
  console.log(bookId, nodeId, sql);

  db.execute(sql).then((results) => {
    console.log(results);
    res.json({
      success: "question updated",
    });
  });
}
