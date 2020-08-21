const dbQuery = require('../models/db.model');
const authorHelpers = require('../helpers/author.helpers');
const commonHelpers = require('../helpers/common.helpers');
const genreHelpers = require('../helpers/genre.helpers');
const Book = require('../models/Book');

const insertBook = book => {
    const { name, description, isbn, pages, authorId, genreId } = book;

    const query = "INSERT INTO  books(name, description, isbn, pages, author_id, genre_id)"
        + " VALUES(?, ?, ?, ?, ?, ?)";

    // execute an insert query
    return dbQuery(query, [name, description, isbn, pages, authorId, genreId]);
};

const getBooksByParams = (id, name, description, isbn, authorId, genreId) => {
    const params = [];

    let query = "SELECT book_id AS 'bookId', name, description, isbn, pages, created_at AS 'createdAt', "
        + "updated_at AS 'updatedAt', author_id AS 'authorId', genre_id AS 'genreId' FROM books WHERE 1 = 1";

    if (id !== null && id !== undefined) {
        query += " AND book_id = ?";
        params.push(id);
    }
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

const getNumOfBooks = (authorId, genreId) => {
    const params = [];

    let query = "SELECT COUNT(1) AS 'count' FROM books WHERE 1 = 1";

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
    const { name, description, isbn, pages, authorId, genreId, id } = book;

    const query = "UPDATE books SET name = ?, description = ?, isbn = ?, pages = ?, "
        + "updated_at = CURRENT_TIMESTAMP(), author_id = ?, genre_id = ? WHERE book_id = ?";

    // execute an update query
    return dbQuery(query, [name, description, isbn, pages, authorId, genreId, id]);
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
        result = await getBooksByParams(result.insertId, null, null, null, null, null);
        const created = result[0];

        // get the author of the book
        const author = await authorHelpers.getAuthorById(created.authorId);

        // get the genre of the book
        const genre = await genreHelpers.getGenreById(created.genreId);

        return new Book(
            created.bookId,
            created.name,
            created.description,
            created.isbn,
            created.pages,
            created.createdAt,
            created.updatedAt,
            author.authorId,
            author,
            genre.genreId,
            genre
        );
    },

    getBookById: async id => {
        // load the requested book
        const result = await getBooksByParams(id, null, null, null, null, null);
        const loaded = result[0];

        // get the author of the book
        const author = await authorHelpers.getAuthorById(loaded.authorId);

        // get the genre of the book
        const genre = await genreHelpers.getGenreById(loaded.genreId);

        return new Book(
            loaded.bookId,
            loaded.name,
            loaded.description,
            loaded.isbn,
            loaded.pages,
            loaded.createdAt,
            loaded.updatedAt,
            author.authorId,
            author,
            genre.genreId,
            genre
        );
    },

    getBooks: async (name, description, isbn, authorId, genreId) => {
        // load the requested books
        const result = await getBooksByParams(null, name, description, isbn, authorId, genreId);

        const books = [];
        let author, genre = {};

        await commonHelpers.asyncForEach(result, async element => {
            // get the author of the book
            author = await authorHelpers.getAuthorById(element.authorId);

            // get the genre of the book
            genre = await genreHelpers.getGenreById(element.genreId);

            books.push(
                new Book(
                    element.bookId,
                    element.name,
                    element.description,
                    element.isbn,
                    element.pages,
                    element.createdAt,
                    element.updatedAt,
                    element.authorId,
                    author,
                    element.genreId,
                    genre
                )
            );
        });

        return books;
    },

    getNumOfBooksByAuthor: async authorId => {
        const result = await getNumOfBooks(authorId, null);

        return result[0].count;
    },

    getNumOfBooksByGenre: async genreId => {
        const result = await getNumOfBooks(null, genreId);
        
        return result[0].count;
    },

    updateBook: async book => {
        // update the book
        let result = await editBook(book);

        if (result.affectedRows === 0) { // no affected rows
            return null;
        }
        else {
            // load the updated book
            result = await getBooksByParams(book.id, null, null, null, null, null);
            const updated = result[0];

            // get the author of the book
            const author = await authorHelpers.getAuthorById(updated.authorId);

            // get the genre of the book
            const genre = await genreHelpers.getGenreById(updated.genreId);

            return new Book(
                updated.bookId,
                updated.name,
                updated.description,
                updated.isbn,
                updated.pages,
                updated.createdAt,
                updated.updatedAt,
                author.authorId,
                author,
                genre.genreId,
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