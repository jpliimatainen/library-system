const helpers = require('../helpers/author.helpers');
const Author = require('../models/Author');


module.exports = {

    createAuthor: async (req, res) => {
        // get POST data
        const { firstname, lastname } = req.body;

        const inputAuthor = new Author(
            null,
            firstname,
            lastname,
            null,
            null
        );

        try {
            // create a new author
            const outputAuthor = await helpers.createAuthor(inputAuthor);

            res.status(201).json({ success: true, data: outputAuthor });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Creating an author failed!' });
        }
    },

    getAuthor: async (req, res) => {
        // get the author id
        const id = req.params.authorId;

        try {
            // load the requested author
            const author = await helpers.getAuthor(id);

            res.json({ success: true, data: author });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the author failed!' });
        }
    },

    getAuthors: async (req, res) => {
        // get query parameteres
        const { firstname, lastname } = req.query;

        try {
            // load the requested authors
            const authors = await helpers.getAuthors(firstname, lastname);

            res.json({ success: true, data: authors });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the authors failed!' });
        }
    },

    updateAuthor: async (req, res) => {
        // get the author id
        const id = req.params.authorId;

        // get PUT data
        const { authorId, firstname, lastname } = req.body;

        if (parseInt(id) !== authorId) {
            // ids not match
            res.status(400).json({ success: false, message: 'Author ids not match.' });
            return;
        }

        const inputAuthor = new Author(
            authorId,
            firstname,
            lastname,
            null,
            null
        );

        try {
            // update the author
            const outputAuthor = await helpers.updateAuthor(inputAuthor);

            if (outputAuthor === null) { // no affected rows
                res.status(400).json({ success: false, message: 'No authors updated.' });
            }
            else {
                res.json({ success: true, data: outputAuthor });
            }
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Updating the author failed!' });
        }
    },

    deleteAuthor: async (req, res) => {
        // get the author id
        const id = req.params.authorId;

        try {
            // delete the requested author
            const result = await helpers.deleteAuthor(id);

            if (result === 0) { // no affected rows
                res.status(400).json({ success: false, message: 'No authors deleted.' });
            }
            else {
                res.json({ success: true, message: `Author with the id ${id} deleted.` });
            }
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Deleting the author failed!' });
        }
    }
};