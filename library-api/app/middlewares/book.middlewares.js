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
    }
};