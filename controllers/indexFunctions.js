import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js";
import { removeHyphens } from "./removeHyphens.js";

export function getIndex(req, res) {
  let sql = `SELECT * FROM books`;
  db.query(sql, (err, results) => {
    if (err) {
      res.json({
        error: err.code,
      });
      return;
    }
    res.json(results);
  });
}
export function postIndex(req, res) {
  let bookid = uuidv4();
  let bookidModified = removeHyphens(bookid);
  let sql = `INSERT INTO books VALUES('${bookid}', '${req.body.title}', '${req.body.type}', '${req.body.author}', '${req.body.description}', '${req.body.isbn}', '${req.body.edition}', '${req.body.published}', '${req.body.publisher}', '${req.body.visibility}', '${req.body.videoAnswersCount}', '${req.body.textAnswersCount}', '${req.body.tocStatus}', '${req.body.popularity}', '${req.body.priority}')`;

  let addTable =
    "CREATE TABLE " +
    bookidModified +
    "(nodeid char(36),type varchar(200),parentid char(36),bookid varchar(200),name varchar(200),page varchar(200),question longtext,answer longtext)";
  db.query(addTable, (errr, result) => {
    if (errr) {
      res.json({
        error: errr.code,
      });
      return;
    }
    console.log(`TOC for ${bookidModified} created`);
  });

  db.query(sql, (err, results) => {
    if (err) {
      res.json({
        error: err.code,
      });
      return;
    }
    console.log(results);

    res.json({
      success: "new book added",
    });
  });
}
