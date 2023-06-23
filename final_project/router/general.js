const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username === undefined || password === undefined) {
      res.status(404).send("You must provide an username and a password");
      return;
  }
  if (!isValid(username)) {
      res.status(404).send("Username isn't valid - Try with another one as this one may be chosen");
      return;
  }
  users.push({"username": username, "password": password});
  return res.status(201).send("Registered succesfully");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book === undefined) {
    res.status(404).send("Book doesn't exist")
    return;
  }
  res.status(200).send(JSON.stringify(book));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  let booksOfAuthor = [];
  bookKeys.forEach((key) => {
    const book = books[key]
    if (book["author"] === author) {
        booksOfAuthor.push(book);
    } 
  });
  return res.status(200).send(JSON.stringify(booksOfAuthor));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  let booksWithTitle = [];
  bookKeys.forEach((key) => {
    const book = books[key];
    if (book["title"] === title) {
        booksWithTitle.push(book);
    }
  });
  return res.status(200).send(JSON.stringify(booksWithTitle));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const bookId = req.params.isbn;
  const book = books[bookId];
  if (book === undefined) {
      res.status(404).send("Book doesn't exist")
      return;
  }
  return res.status(200).send(JSON.stringify(book["reviews"]));
});

module.exports.general = public_users;
