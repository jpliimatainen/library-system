const authorHelpers = require('../helpers/author.helpers');
const bookHelpers = require('../helpers/book.helpers');
const genreHelpers = require('../helpers/genre.helpers');

module.exports = {
    checkBookIdMismatch: (req, res, next) => {
        // get the book ids
        const id = req.params.bookId;
        const { bookId } = req.body;

        if (parseInt(id) !== bookId) {
            // ids not match
            res.status(400).json({ success: false, message: 'Book ids not match.' });
            return;
        }

        next();
    },

    checkEmptyFields: (req, res, next) => {
        // get input fields
        const { name, isbn } = req.body;

        const emptyFields = [];

        if (name === null || name === undefined || name === '') {
            emptyFields.push('name');
        }
        if (isbn === null || isbn === undefined || isbn === '') {
            emptyFields.push('isbn');
        }

        if (emptyFields.length > 0) {
            // empty field(s) exist(s)
            res.status(400).json({ success: false, fields: emptyFields, message: 'Fields cannot be empty' });
            return;
        }

        next();
    },

    checkDuplicateBook: async (req, res, next) => {
        const { isbn } = req.body;

        // get the book id (if set)
        const id = req.params.bookId || null;

        try {
            // load the requested book
            const books = await bookHelpers.getBooks(null, null, isbn, null, null);
            
            if (books.length > 0) {
                if (id === null) { // inserting a new book
                    res.status(400).json({ success: false, message: 'A book exists with the given isbn!' });
                    return;
                }
                else { // updating an book
                    if (books[0].id !== parseInt(id)) {
                        // another book having the same isbn
                        res.status(400).json({ success: false, message: 'A book exists with the given isbn!' });
                        return;
                    }
                }
            }

            next();
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the books failed!' });
        }
    },

    checkIntegrityErrors: async (req, res, next) => {
        const { authorId, genreId } = req.body;

        try {
            // load the author of the book
            const author = await authorHelpers.getAuthor(authorId);
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'An invalid author id given!' });
        }

        try {
            // load the genre of the book
            const author = await genreHelpers.getGenre(genreId);

            next();
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'An invalid genre id given!' });
        }
    }
};