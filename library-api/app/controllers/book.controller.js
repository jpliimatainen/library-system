const helpers = require('../helpers/book.helpers');
const Book = require('../models/Book');


module.exports = {

    createBook: async (req, res) => {
        // get POST data
        const { name, description, isbn, pages, authorId, genreId } = req.body;

        const inputBook = new Book(
            null,
            name,
            description,
            isbn,
            pages,
            null,
            null,
            authorId,
            null,
            genreId,
            null
        );

        try {
            // create a new book
            const outputBook = await helpers.createBook(inputBook);

            res.status(201).json({ success: true, data: outputBook });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Creating an book failed!' });
        }
    },

    getBook: async (req, res) => {
        // get the book id
        const id = req.params.bookId;

        try {
            // load the requested book
            const book = await helpers.getBook(id);

            res.json({ success: true, data: book });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the book failed!' });
        }
    },

    getBooks: async (req, res) => {
        // get query parameteres
        const { name, description, isbn, authorId, genreId } = req.query;

        try {
            // load the requested books
            const books = await helpers.getBooks(name, description, isbn, authorId, genreId);

            res.json({ success: true, data: books });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the books failed!' });
        }
    },

    updateBook: async (req, res) => {
        // get the book id
        const id = req.params.bookId;

        // get PUT data
        const { name, description, isbn, pages, authorId, genreId } = req.body;

        const inputBook = new Book(
            id,
            name,
            description,
            isbn,
            pages,
            null,
            null,
            authorId,
            null,
            genreId,
            null
        );

        try {
            // update the book
            const outputBook = await helpers.updateBook(inputBook);

            if (outputBook === null) { // no affected rows
                res.status(400).json({ success: false, message: 'No books updated.' });
            }
            else {
                res.json({ success: true, data: outputBook });
            }
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Updating the book failed!' });
        }
    },

    deleteBook: async (req, res) => {
        // get the book id
        const id = req.params.bookId;

        try {
            // delete the requested book
            const result = await helpers.deleteBook(id);

            if (result === 0) { // no affected rows
                res.status(400).json({ success: false, message: 'No books deleted.' });
            }
            else {
                res.json({ success: true, message: `Book with the id ${id} deleted.` });
            }
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Deleting the book failed!' });
        }
    }
};