const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios").default;
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
  let booksStringifier = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books));
  });
  booksStringifier.then((result) => {
    res.status(200).send(result);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let bookStringifier = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book === undefined) {
      throw new Error();
    }
    resolve(JSON.stringify(book));
  });

  bookStringifier.catch((reason) => {
    res.status(404).send("Book doesn't exist");
    return;
  });

  bookStringifier.then((book) => {
    res.status(200).send(book);
  });

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    let booksOfAuthor = [];
    bookKeys.forEach((key) => {
      const book = books[key]
      if (book["author"] === author) {
          booksOfAuthor.push(book);
      }   
    });
    resolve(JSON.stringify(booksOfAuthor));
  })
  .then(filteredBooksJSON => {
    res.status(200).send(filteredBooksJSON);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    let booksWithTitle = [];
    bookKeys.forEach((key) => {
      const book = books[key];
      if (book["title"] === title) {
          booksWithTitle.push(book);
      }
    });
    resolve(JSON.stringify(booksWithTitle));  
  })
  .then((filteredBooksJSON) => {
    res.status(200).send(filteredBooksJSON);
  });
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
