const fs = require("fs");/** Common config for bookstore. */

let db_password = fs.readFileSync("/var/www/cerebro/CodingBootcamp/Excercises/Node/express-bookstore/db_password.txt", "utf8").trim();

let DB_URI = process.env.NODE_ENV === "test" ? `postgresql://akindeji:${db_password}@localhost:5432/bookstore_test` : `postgresql://akindeji:${db_password}@localhost:5432/bookstore`;



module.exports = { DB_URI };