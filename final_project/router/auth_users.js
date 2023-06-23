const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
require('dotenv').config();
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let isChosen = false;
    users.forEach((user) => {
        isChosen = isChosen || user.username === username;
    });
    return !isChosen;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let exists = false;
    users.forEach((user) => {
        exists = exists || (user.username === username && user.password === password);
    });
    return exists;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!authenticatedUser(username, password)) {
    res.status(404).send("Invalid credentials");  
    return;
  }
  let accessToken = jwt.sign({
      data: password
    }, process.env.JWTSecret, { expiresIn: 60 * 60 });
    req.session.authorization = {
      "token": accessToken, "username": username
  }
    
  return res.status(201).send("Logged in successfully");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const bookId = req.params.isbn;
  const username = req.session.authorization.username;

  books[bookId].reviews[username] = review;
  console.log(review);
  console.log(books[bookId]);
  return res.status(200).send("Reviews updated correctly");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const bookId = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[bookId].reviews[username])
    {
        delete books[bookId].reviews[username];
    }
    res.status(204).send("Resource deleted Succesfully")
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
