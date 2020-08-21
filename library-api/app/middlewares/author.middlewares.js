const authorHelpers = require('../helpers/author.helpers');
const bookHelpers = require('../helpers/book.helpers');

module.exports = {
    checkAuthorIdMismatch: (req, res, next) => {
        // get the author ids
        const id = req.params.authorId;
        const { authorId } = req.body;

        if (parseInt(id) !== authorId) {
            // ids not match
            return res.status(400).json({ success: false, message: 'Author ids not match.' });
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
            return res.status(400).json({ success: false, fields: emptyFields, message: 'Fields cannot be empty' });
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
                    return res.status(400).json({ success: false, message: 'An author exists with the given name!' });
                }
                else { // updating an author
                    if (authors[0].id !== parseInt(id)) {
                        // another author having the same name
                        return res.status(400).json({ success: false, message: 'An author exists with the given name!' });
                    }
                }
            }
            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the authors failed!' });
        }
    },

    checkIntegrityError: async (req, res, next) => {
        // get the author id
        const id = req.params.authorId;

        try {
            // get the number of books for the author
            const count = await bookHelpers.getNumOfBooksByAuthor(id);

            if (count > 0) { 
                return res.status(400).json({ success: false, message: 'Book(s) exist(s) for the author!' });
            }
            
            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the books failed!' });
        }
    }
};