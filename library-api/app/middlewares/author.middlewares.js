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
    }
};