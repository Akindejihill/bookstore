const jsonschema = require("jsonschema");
const newBookSchema = require("../schemas/newBookSchema.json");
const editBookSchema = require("../schemas/editBookSchema.json");

const express = require("express");
const Book = require("../models/book");
const ExpressError = require("../expressError");

const router = new express.Router();

//lets try it as middleware
const validateNewBook = function(req, res, next){
  const input = jsonschema.validate(req.body, newBookSchema);
  if (!input.valid){
    let errorList = input.errors.map(error => error.stack);
    const err = new ExpressError(errorList, 400);
    return next(err);
  }
  console.log("\n\nValidated new book!")
  return next();
}

const validateBookEdits = function(req, res, next){
  const input = jsonschema.validate(req.body, editBookSchema);
  if (!input.valid){
    let errorList = input.errors.map(error => error.stack);
    const err = new ExpressError(errorList, 400);
    return next(err);
  }
  console.log("\n\nValidated new book!")
  return next();
}


/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  console.log("\n\n\n Get Route!");
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", validateNewBook, async function (req, res, next) {
  console.log("\n\n\n Post Route!");
  try {
    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[isbn]   bookData => {book: updatedBook}  */

router.patch("/:isbn", validateBookEdits, async function (req, res, next) {
  console.log("\n\nPATCHING!");
  try {
    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
