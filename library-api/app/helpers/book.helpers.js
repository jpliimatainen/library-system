const dbQuery = require('../models/db.model');
const authorHelpers = require('../helpers/author.helpers');
const commonHelpers = require('../helpers/common.helpers');
const genreHelpers = require('../helpers/genre.helpers');
const Book = require('../models/Book');

const insertBook = book => {
    const query = "INSERT INTO  books(name, description, isbn, pages, author_id, genre_id)"
        + " VALUES(?, ?, ?, ?, ?, ?)";

    // execute an insert query
    return dbQuery(query, [book.name, book.description, book.isbn, book.pages, book.authorId, book.genreId]);
};

const getBookById = id => {
    const query = "SELECT book_id, name, description, isbn, pages, created_at, updated_at, author_id, genre_id"
        + " FROM books WHERE book_id = ?";

    // execute a select query
    return dbQuery(query, [id]);
};

const getBooksByParams = (name, description, isbn, authorId, genreId) => {
    const params = [];

    let query = "SELECT book_id, name, description, isbn, pages, created_at, "
        + "updated_at, author_id, genre_id FROM books WHERE 1 = 1";

    if (name !== null && name !== undefined) {
        query += " AND UPPER(name) LIKE ?";
        params.push('%' + name.toUpperCase() + '%');
    }
    if (description !== null && description !== undefined) {
        query += " AND UPPER(description) LIKE ?";
        params.push('%' + description.toUpperCase() + '%');
    }
    if (isbn !== null && isbn !== undefined) {
        query += " AND UPPER(isbn) = ?";
        params.push(isbn.toUpperCase());
    }
    if (authorId !== null && authorId !== undefined) {
        query += " AND author_id = ?";
        params.push(authorId);
    }
    if (genreId !== null && genreId !== undefined) {
        query += " AND genre_id = ?";
        params.push(genreId);
    }

    // execute a select query
    return dbQuery(query, params);
};

const editBook = book => {
    const query = "UPDATE books SET name = ?, description = ?, isbn = ?, pages = ?, "
        + "updated_at = CURRENT_TIMESTAMP(), author_id = ?, genre_id = ? WHERE book_id = ?";

    // execute an update query
    return dbQuery(query, [book.name, book.description, book.isbn, book.pages,
    book.authorId, book.genreId, book.id]);
};

const removeBook = id => {
    const query = "DELETE FROM books WHERE book_id = ?";

    // execute a delete query
    return dbQuery(query, [id]);
};

module.exports = {

    createBook: async book => {
        // create a new book
        let result = await insertBook(book);

        // load the created book
        result = await getBookById(result.insertId);
        const created = result[0];

        // get the author of the book
        const author = await authorHelpers.getAuthor(created.author_id);

        // get the genre of the book
        const genre = await genreHelpers.getGenre(created.genre_id);

        return new Book(
            created.book_id,
            created.name,
            created.description,
            created.isbn,
            created.pages,
            created.created_at,
            created.updated_at,
            author.author_id,
            author,
            genre.genre_id,
            genre
        );
    },

    getBook: async id => {
        // load the requested book
        const result = await getBookById(id);
        const loaded = result[0];

        // get the author of the book
        const author = await authorHelpers.getAuthor(loaded.author_id);

        // get the genre of the book
        const genre = await genreHelpers.getGenre(loaded.genre_id);

        return new Book(
            loaded.book_id,
            loaded.name,
            loaded.description,
            loaded.isbn,
            loaded.pages,
            loaded.created_at,
            loaded.updated_at,
            author.author_id,
            author,
            genre.genre_id,
            genre
        );
    },

    getBooks: async (name, description, isbn, authorId, genreId) => {
        // load the requested books
        const result = await getBooksByParams(name, description, isbn, authorId, genreId);
        
        const books = [];
        let author, genre = {};
        
        await commonHelpers.asyncForEach(result, async element => {
            // get the author of the book
            author = await authorHelpers.getAuthor(element.author_id);

            // get the genre of the book
            genre = await genreHelpers.getGenre(element.genre_id);

            books.push(
                new Book(
                    element.book_id,
                    element.name,
                    element.description,
                    element.isbn,
                    element.pages,
                    element.created_at,
                    element.updated_at,
                    element.author_id,
                    author,
                    element.genre_id,
                    genre
                )
            );
        });
        
        return books;
    },

    updateBook: async book => {
        // update the book
        let result = await editBook(book);

        if (result.affectedRows === 0) { // no affected rows
            return null;
        }
        else {
            // load the updated book
            result = await getBookById(book.id);
            const updated = result[0];

            // get the author of the book
            const author = await authorHelpers.getAuthor(updated.author_id);

            // get the genre of the book
            const genre = await genreHelpers.getGenre(updated.genre_id);

            return new Book(
                updated.book_id,
                updated.name,
                updated.description,
                updated.isbn,
                updated.pages,
                updated.created_at,
                updated.updated_at,
                author.author_id,
                author,
                genre.genre_id,
                genre
            );
        }
    },

    deleteBook: async id => {
        // delete the requested book
        const result = await removeBook(id);

        return result.affectedRows;
    }
};