process.env.NODE_ENV = "test";
const app = require("./app");
const request = require("supertest");
const db = require("./db");


/************************************************************
 * Setup and teardown
 */

beforeAll(async () => {
    await db.query(
        `CREATE TABLE books (
            isbn TEXT PRIMARY KEY,
            amazon_url TEXT,
            author TEXT,
            language TEXT, 
            pages INTEGER,
            publisher TEXT,
            title TEXT, 
            year INTEGER
        )`
    );
});

// beforeEach( async() => {
//     await db.query(
//         `INSERT INTO books (
//             isbn,
//             amazon_url,
//             author,
//             language,
//             pages,
//             publisher,
//             title,
//             year) 
//         VALUES (0691161518, 
//                 "http://a.co/eobPtX2", 
//                 "Matthew Lane", 
//                 "english", 
//                 264, 
//                 "Princeton University Press", 
//                 "Power-Up: Unlocking the Hidden Mathematics in Video Games", 
//                 2017);`
//     );
// });

afterEach(() => {
    
});

afterAll(() => {
    db.query(`DROP TABLE IF EXISTS books;`);
    db.end();
});



/************************************************************
 * Tests
 */
describe("Test Routes", () => {
    test("Test Post", async () => {
        const resp = await request(app).post("/books").send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        });
    
        expect(resp.status).toBe(201);
        expect(resp.body).toEqual({
            "book": {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
        });
    });


    test("get all", async () => {
        const resp = await request(app).get("/books");
        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({
            "books": [
                {
                    "isbn": "0691161518",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Matthew Lane",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                }
            ]
        });
    });

    test("get book", async () => {
        const resp = await request(app).get("/books/0691161518");
        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({
            "book": {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
        });
    });


    test("Test Patch", async () => {
        const resp = await request(app).patch("/books/0691161518").send({"pages": 1});
        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({
            "book": {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 1,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
        });
    } );


    test("Test delete", async () => {
        const resp = await request(app).delete("/books/0691161518");
        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({
            "message": "Book deleted"
        });

    });


});