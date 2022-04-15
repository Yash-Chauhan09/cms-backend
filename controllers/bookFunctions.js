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

  db.execute(
    `INSERT INTO ${bookTable} VALUES('${uuid}','${req.body.type}','${req.body.parentid}','${req.body.bookid}','${req.body.name}','${req.body.page}','${req.body.question}','${req.body.answer}')`
  ).then((results) => {
    console.log(results);
    res.json({
      success: "new node added in TOC",
    });
  });
}

export function updateBook(req, res) {
  let bookId = req.params.bookid;

  let sql = `UPDATE books SET type = '${req.body.type}',isbn = '${req.body.isbn}',edition = '${req.body.edition}', published = '${req.body.published}',publisher = '${req.body.publisher}',title = '${req.body.title}', subject = '${req.body.subject}', author = '${req.body.author}', description = '${req.body.description}', board = '${req.body.board}', class = '${req.body.class}', lang = '${req.body.lang}', other_tags = '${req.body.other_tags}', cover = '${req.body.cover}' WHERE bookid = '${bookId}'`;
  db.execute(sql).then((results) => {
    console.log(results);
    res.json({
      success: "book updated",
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
  let obj = {};
  db.execute(`SELECT * FROM books WHERE bookid = '${req.params.bookid}'`).then(
    (results) => {
      console.log(results[0]);
      obj.book_info = results[0][0];
      db.execute(sql).then((result) => {
        console.log(result);
        obj.toc = result[0];
        res.json(obj);
      });
    }
  );
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
    obj.node_info = results[0][0];
  });

  let sql2 = `SELECT * FROM quality_checking WHERE node_id='${req.params.nodeid}'`;

  db.execute(sql2).then((results) => {
    console.log(results);
    obj.remarks_info = results[0];
    res.json(obj);
  });
}

export function generateCSVfileContent(req, res) {
  let bookId = removeHyphens(req.params.bookid);
  db.execute(`SELECT * FROM books WHERE bookid = '${req.params.bookid}'`)
    .then((result) => {
      let isbn = result[0][0].isbn;
      let bookName = result[0][0].title;

      db.execute(`SELECT * FROM ${bookId}`)
        .then((results) => {
          console.log(results[0].length);
          let arr = [];
          for (let i = 0; i < results[0].length; i++) {
            let currentNode = results[0][i];
            console.log("current node i = ", i, currentNode);
            let nodeArr = {};
            nodeArr.ISBN = isbn;
            nodeArr.Book_Title = bookName;
            nodeArr.Name = currentNode.name;
            nodeArr.Page = currentNode.page;
            if (currentNode.type == "question") {
              nodeArr.Question_Exists = true;
              nodeArr.Question_Link = `https://freecoedu-cms.herokuapp.com/index/book/${bookId}/node/${currentNode.nodeid}`;
            } else {
              nodeArr.Question_Exists = false;
              nodeArr.Question_Link = null;
            }
            if (currentNode.answer == "null") {
              nodeArr.Answer_Exists = false;
              nodeArr.Answer_Link = null;
            } else {
              nodeArr.Answer_Exists = true;
              nodeArr.Answer_Link = `https://freecoedu-cms.herokuapp.com/index/book/${bookId}/node/${currentNode.nodeid}`;
            }
            nodeArr.Video_Exists = false;
            nodeArr.Video_Link = null;
            console.log(nodeArr);
            arr.push(nodeArr);
          }
          res.send(arr);
        })
        .catch((err) => {
          res.json(err.code);
        });
    })
    .catch((err) => {
      res.json(err.code);
    });
}
