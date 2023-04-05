const db = require("../db");


/** Collection of related methods for books. */

class Book {
  /** given an isbn, return book data with that isbn:
   *
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   **/
  constructor(isbn, amazon_url, author, language, pages, publisher, title, year){
    this.isbn = isbn;
    this.amazon_url = amazon_url;
    this.author = author;
    this.language = language;
    this.pages = pages;
    this.publisher = publisher;
    this.title = title;
    this.year = year;
  }

  static async findOne(isbn) {
    const bookRes = await db.query(
        `SELECT isbn,
                amazon_url,
                author,
                language,
                pages,
                publisher,
                title,
                year
            FROM books 
            WHERE isbn = $1`, [isbn]);

    if (bookRes.rows.length === 0) {
      throw { message: `There is no book with an isbn '${isbn}`, status: 404 }
    }

    return bookRes.rows[0];
  }

  /** Return array of book data:
   *
   * => [ {isbn, amazon_url, author, language,
   *       pages, publisher, title, year}, ... ]
   *
   * */

  static async findAll() {
    const booksRes = await db.query(
        `SELECT isbn,
                amazon_url,
                author,
                language,
                pages,
                publisher,
                title,
                year
            FROM books 
            ORDER BY title`);

    return booksRes.rows;
  }

  /** create book in database from data, return book data:
   *
   * {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * */

  static async create(data) {
    try{
      const result = await db.query(
        `INSERT INTO books (
              isbn,
              amazon_url,
              author,
              language,
              pages,
              publisher,
              title,
              year) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
          RETURNING isbn,
                    amazon_url,
                    author,
                    language,
                    pages,
                    publisher,
                    title,
                    year`,
        [
          data.isbn,
          data.amazon_url,
          data.author,
          data.language,
          data.pages,
          data.publisher,
          data.title,
          data.year
        ]
      );

      return result.rows[0];
    } catch (err) {
      //next(err);
      return {"error" : "Database failed"};
    }
  }

  /** Update data with matching ID to data, return updated book.

   * {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * */

  static async update(isbn, data) {

    //get current book data
    const current = await db.query(
      `SELECT isbn,
              amazon_url,
              author,
              language,
              pages,
              publisher,
              title,
              year
          FROM books 
          WHERE isbn = $1`, [isbn]);

    if (current.rows.length === 0) {
      throw { message: `There is no book with an isbn '${isbn}`, status: 404 }
    }

    const book = current.rows[0];
    
    this.isbn = book.isbn;
    this.amazon_url = book.amazon_url;
    this.author = book.author;
    this.language = book.language;
    this.pages = book.pages;
    this.publisher = book.publisher;
    this.title =  book.title;
    this.year =  book.year;

    //update book data
    if (data.amazon_url) this.amazon_url = data.amazon_url;
    if (data.author) this.author = data.author;
    if (data.language) this.language = language;
    if (data.pages) this.pages = data.pages;
    if (data.publisher) this.publisher = data.publisher;
    if (data.title) this.title = data.title;
    if (data.year) this.year = data.year;

    const result = await db.query(
      `UPDATE books SET 
            amazon_url=($1),
            author=($2),
            language=($3),
            pages=($4),
            publisher=($5),
            title=($6),
            year=($7)
            WHERE isbn=$8
        RETURNING isbn,
                  amazon_url,
                  author,
                  language,
                  pages,
                  publisher,
                  title,
                  year`,
      [
        this.amazon_url,
        this.author,
        this.language,
        this.pages,
        this.publisher,
        this.title,
        this.year,
        isbn
      ]
    );

    return result.rows[0];
  }

  /** remove book with matching isbn. Returns undefined. */

  static async remove(isbn) {
    const result = await db.query(
      `DELETE FROM books 
         WHERE isbn = $1 
         RETURNING isbn`,
        [isbn]);

    if (result.rows.length === 0) {
      throw { message: `There is no book with an isbn '${isbn}`, status: 404 }
    }
  }
}


module.exports = Book;
