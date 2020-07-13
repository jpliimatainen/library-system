const helpers = require('../helpers/user.helpers');

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
    },

    checkPasswordMismatch: (req, res, next) => {
        const { password, passwordConfirmed } = req.body;

        if (password !== passwordConfirmed) {
            res.status(400).json({ success: false, message: 'Given passwords do not match!' });
            return;
        }

        next();
    },

    checkDuplicateEmail: async (req, res, next) => {
        const { email } = req.body;
        // get the user id (if set)
        const id = req.params.userId || null;

        try {
            // load the requested user
            const users = await helpers.getUsers(email, null);

            if (users.length > 0) {
                if (id === null) { // inserting a new user
                    res.status(400).json({ success: false, message: 'A user exists with the given email!' });
                    return;
                }
                else { // updating a user
                    if (users[0].id !== parseInt(id)) {
                        // another user having the same email
                        res.status(400).json({ success: false, message: 'A user exists with the given email!' });
                        return;
                    }
                }
            }
            next();
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the users failed!' });
        }
    }
};