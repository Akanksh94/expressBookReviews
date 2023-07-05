const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });

  //return res.status(300).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  
    try {
      const response = await axios.get('http://localhost:5000/books');
      const books = response.data;
      res.status(200).json({ books: JSON.stringify(books) });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
  
  //return res.status(300).json({ books: JSON.stringify(books) });
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const book = await Promise.resolve(books[isbn]);
    if (book) {
      res.status(200).json({ book: JSON.stringify(book) });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  //return res.status(300).json({ book: JSON.stringify(book) });
  
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    const bookKeys = await Promise.resolve(Object.keys(books));
    const booksByAuthor = bookKeys.filter(key => books[key].author === author);
    if (booksByAuthor.length > 0) {
      res.status(200).json({ books: JSON.stringify(booksByAuthor.map(key => books[key])) });
    } else {
      res.status(404).json({ message: 'No books found by this author' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

 // return res.status(300).json({ books: JSON.stringify(booksByAuthor.map(key => books[key])) });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    const bookKeys = await Promise.resolve(Object.keys(books));
    const booksByTitle = bookKeys.filter(key => books[key].title === title);
    if (booksByTitle.length > 0) {
      res.status(200).json({ books: JSON.stringify(booksByTitle.map(key => books[key])) });
    } else {
      res.status(404).json({ message: 'No books found with this title' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  //return res.status(300).json({ books: JSON.stringify(booksByTitle.map(key => books[key])) });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json({ reviews: JSON.stringify(book.reviews) });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }

 // return res.status(300).json({ reviews: JSON.stringify(book.reviews) });
});



module.exports.general = public_users;
