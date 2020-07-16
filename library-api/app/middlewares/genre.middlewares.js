const genreHelpers = require('../helpers/genre.helpers');
const bookHelpers = require('../helpers/book.helpers');

module.exports = {
    checkGenreIdMismatch: (req, res, next) => {
        // get the genre ids
        const id = req.params.genreId;
        const { genreId } = req.body;

        if (parseInt(id) !== genreId) {
            // ids not match
            return res.status(400).json({ success: false, message: 'Genre ids not match.' });
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
            return res.status(400).json({ success: false, fields: emptyFields, message: 'Fields cannot be empty' });
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
                    return res.status(400).json({ success: false, message: 'A genre exists with the given classification!' });
                }
                else { // updating an genre
                    if (genres[0].id !== parseInt(id)) {
                        // another genre having the same name
                        return res.status(400).json({ success: false, message: 'A genre exists with the given classification!' });
                    }
                }
            }
            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the genres failed!' });
        }
    },

    checkIntegrityError: async (req, res, next) => {
        // get the genre id
        const id = req.params.genreId;

        try {
            // load books of the genre
            const books = await bookHelpers.getBooks(null, null, null, id);

            if (books.length > 0) { 
                return res.status(400).json({ success: false, message: 'Book(s) exist(s) for the genre!' });
            }
            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the genres failed!' });
        }
    }
};