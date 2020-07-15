const authorHelpers = require('../helpers/author.helpers');
const bookHelpers = require('../helpers/book.helpers');

module.exports = {
    checkAuthorIdMismatch: (req, res, next) => {
        // get the author ids
        const id = req.params.authorId;
        const { authorId } = req.body;

        if (parseInt(id) !== authorId) {
            // ids not match
            res.status(400).json({ success: false, message: 'Author ids not match.' });
            return;
        }

        next();
    },

    checkEmptyFields: (req, res, next) => {
        // get input fields
        const { firstname, lastname } = req.body;

        const emptyFields = [];

        if (firstname === null || firstname === undefined || firstname === '') {
            emptyFields.push('firstname');
        }
        if (lastname === null || lastname === undefined || lastname === '') {
            emptyFields.push('lastname');
        }

        if (emptyFields.length > 0) {
            // empty field(s) exist(s)
            res.status(400).json({ success: false, fields: emptyFields, message: 'Fields cannot be empty' });
            return;
        }

        next();
    },

    checkDuplicateAuthor: async (req, res, next) => {
        const { firstname, lastname } = req.body;

        // get the author id (if set)
        const id = req.params.authorId || null;

        try {
            // load the requested author
            const authors = await authorHelpers.getAuthors(firstname, lastname);

            if (authors.length > 0) {
                if (id === null) { // inserting a new author
                    res.status(400).json({ success: false, message: 'An author exists with the given name!' });
                    return;
                }
                else { // updating an author
                    if (authors[0].id !== parseInt(id)) {
                        // another author having the same name
                        res.status(400).json({ success: false, message: 'An author exists with the given name!' });
                        return;
                    }
                }
            }
            next();
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the authors failed!' });
        }
    },

    checkIntegrityError: async (req, res, next) => {
        // get the author id
        const id = req.params.authorId;

        try {
            // load books of the author
            const books = await bookHelpers.getBooks(null, null, id, null);

            if (books.length > 0) { 
                res.status(400).json({ success: false, message: 'Book(s) exist(s) for the author!' });
                return;
            }
            next();
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the books failed!' });
        }
    }
};