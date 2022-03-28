import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js";
import { removeHyphens } from "./removeHyphens.js";

export function getIndex(req, res) {
  let sql = `SELECT * FROM books`;
  db.execute(sql).then((results) => {
    res.json(results[0]);
  });
}
export function postIndex(req, res) {
  let bookid = uuidv4();
  let bookidModified = removeHyphens(bookid);
  let sql = `INSERT INTO books VALUES('${bookid}', '${req.body.type}', '${req.body.isbn}', '${req.body.edition}', '${req.body.published}', '${req.body.publisher}', '${req.body.title}', '${req.body.subject}', '${req.body.author}', '${req.body.description}', '${req.body.board}', '${req.body.class}', '${req.body.lang}', '${req.body.other_tags}', '${req.body.cover}')`;

  let addTable =
    "CREATE TABLE " +
    bookidModified +
    "(nodeid char(36),type varchar(200),parentid char(36),bookid varchar(200),name varchar(200),page varchar(200),question longtext,answer longtext)";

  db.execute(addTable).then((results) => {
    console.log(`TOC for ${bookidModified} created`);
  });
  db.execute(sql).then((results) => {
    console.log(results);
    res.json({
      success: "new book added",
    });
  });
}
