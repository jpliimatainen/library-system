const genreHelpers = require('../helpers/genre.helpers');
const bookHelpers = require('../helpers/book.helpers');

module.exports = {
    checkGenreIdMismatch: (req, res, next) => {
        // get the genre ids
        const id = req.params.genreId;
        const { genreId } = req.body;

        if (parseInt(id) !== genreId) {
            // ids not match
            res.status(400).json({ success: false, message: 'Genre ids not match.' });
            return;
        }

        next();
    },

    checkEmptyFields: (req, res, next) => {
        // get input fields
        const { classification, name } = req.body;

        const emptyFields = [];

        if (classification === null || classification === undefined || classification === '') {
            emptyFields.push('classification');
        }
        if (name === null || name === undefined || name === '') {
            emptyFields.push('name');
        }

        if (emptyFields.length > 0) {
            // empty field(s) exist(s)
            res.status(400).json({ success: false, fields: emptyFields, message: 'Fields cannot be empty' });
            return;
        }

        next();
    },

    checkDuplicateGenre: async (req, res, next) => {
        const { classification } = req.body;

        // get the genre id (if set)
        const id = req.params.genreId || null;

        try {
            // load the requested genre
            const genres = await genreHelpers.getGenres(classification, null);

            if (genres.length > 0) {
                if (id === null) { // inserting a new genre
                    res.status(400).json({ success: false, message: 'A genre exists with the given classification!' });
                    return;
                }
                else { // updating an genre
                    if (genres[0].id !== parseInt(id)) {
                        // another genre having the same name
                        res.status(400).json({ success: false, message: 'A genre exists with the given classification!' });
                        return;
                    }
                }
            }
            next();
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the genres failed!' });
        }
    },

    checkIntegrityError: async (req, res, next) => {
        // get the genre id
        const id = req.params.genreId;

        try {
            // load books of the genre
            const books = await bookHelpers.getBooks(null, null, null, id);

            if (books.length > 0) { 
                res.status(400).json({ success: false, message: 'Book(s) exist(s) for the genre!' });
                return;
            }
            next();
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the genres failed!' });
        }
    }
};