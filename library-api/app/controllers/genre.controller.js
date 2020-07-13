const helpers = require('../helpers/genre.helpers');
const Genre = require('../models/Genre');


module.exports = {

    createGenre: async (req, res) => {
        // get POST data
        const { classification, name } = req.body;

        const inputGenre = new Genre(
            null,
            classification,
            name,
            null,
            null
        );

        try {
            // create a new genre
            const outputGenre = await helpers.createGenre(inputGenre);

            res.status(201).json({ success: true, data: outputGenre });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Creating an genre failed!' });
        }
    },

    getGenre: async (req, res) => {
        // get the genre id
        const id = req.params.genreId;

        try {
            // load the requested genre
            const genre = await helpers.getGenre(id);

            res.json({ success: true, data: genre });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the genre failed!' });
        }
    },

    getGenres: async (req, res) => {
        // get query parameteres
        const { classification, name } = req.query;

        try {
            // load the requested genres
            const genres = await helpers.getGenres(classification, name);

            res.json({ success: true, data: genres });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the genres failed!' });
        }
    },

    updateGenre: async (req, res) => {
        // get the genre id
        const id = req.params.genreId;

        // get PUT data
        const { genreId, classification, name } = req.body;

        if (parseInt(id) !== genreId) {
            // ids not match
            res.status(400).json({ success: false, message: 'Genre ids not match.' });
            return;
        }

        const inputGenre = new Genre(
            genreId,
            classification,
            name,
            null,
            null
        );

        try {
            // update the genre
            const outputGenre = await helpers.updateGenre(inputGenre);

            if (outputGenre === null) { // no affected rows
                res.status(400).json({ success: false, message: 'No genres updated.' });
            }
            else {
                res.json({ success: true, data: outputGenre });
            }
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Updating the genre failed!' });
        }
    },

    deleteGenre: async (req, res) => {
        // get the genre id
        const id = req.params.genreId;

        try {
            // delete the requested genre
            const result = await helpers.deleteGenre(id);

            if (result === 0) { // no affected rows
                res.status(400).json({ success: false, message: 'No genres deleted.' });
            }
            else {
                res.json({ success: true, message: `Genre with the id ${id} deleted.` });
            }
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Deleting the genre failed!' });
        }
    }
};