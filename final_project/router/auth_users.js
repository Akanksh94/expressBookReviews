const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
    req.session.user = token;
    res.status(200).json({ message: "Logged in successfully" });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }

  //return res.status(300).json({message: "Logged in successfully"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const review = req.query.review;
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }
  const username = jwt.verify(req.session.user, "fingerprint_customer").username;
  book.reviews[username] = review;
  res.status(200).json({ message: "Review added/updated successfully" });

 // return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const username = jwt.verify(req.session.user, "fingerprint_customer").username;
    if (book.reviews[username]) {
      delete book.reviews[username];
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  });
  
  


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
