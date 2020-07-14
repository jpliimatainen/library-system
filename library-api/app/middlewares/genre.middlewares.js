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
    }
};