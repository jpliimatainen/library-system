module.exports = {
    checkUserIdMismatch: (req, res, next) => {
        // get the user ids
        const id = req.params.userId;
        const { userId } = req.body;

        if (parseInt(id) !== userId) {
            // ids not match
            res.status(400).json({ success: false, message: 'User ids not match.' });
            return;
        }

        next();
    }
};