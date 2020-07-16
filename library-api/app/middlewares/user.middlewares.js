const userHelpers = require('../helpers/user.helpers');

module.exports = {
    checkUserIdMismatch: (req, res, next) => {
        // get the user ids
        const id = req.params.userId;
        const { userId } = req.body;

        if (parseInt(id) !== userId) {
            // ids not match
            return res.status(400).json({ success: false, message: 'User ids not match.' });
        }

        next();
    },

    checkEmptyFields: (req, res, next) => {
        // get input fields
        const { email, password, passwordConfirmed } = req.body;

        const emptyFields = [];

        if (email === null || email === undefined || email === '') {
            emptyFields.push('email');
        }
        if (password === null || password === undefined || password === '') {
            emptyFields.push('password');
        }
        if (passwordConfirmed === null || passwordConfirmed === undefined || passwordConfirmed === '') {
            emptyFields.push('passwordConfirmed');
        }

        if (emptyFields.length > 0) {
            // empty field(s) exist(s)
            return res.status(400).json({ success: false, fields: emptyFields, message: 'Fields cannot be empty' });
        }

        next();
    },

    checkInvalidEmail: (req, res, next) => {
        // get input field
        const { email } = req.body;

        // a valid email pattern
        const pattern = /^(\w|\.)+@(\w)+\.(\w){2,3}$/;
        
        if (pattern.exec(email) === null) {
            return res.status(400).json({ success: false, message: 'An invalid email given!' });
        }
        
        next();
    },

    checkInvalidPassword: (req, res, next) => {
        // get input fields
        const { password, passwordConfirmed } = req.body;

        if (password !== passwordConfirmed) {
            return res.status(400).json({ success: false, message: 'Passwords not match!' });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must contain at least 8 characters!' });
        }

        next();
    },

    checkDuplicateUser: async (req, res, next) => {
        const { email } = req.body;

        // get the user id (if set)
        const id = req.params.userId || null;

        try {
            // load the requested user
            const users = await userHelpers.getUsers(email, null);

            if (users.length > 0) {
                if (id === null) { // inserting a new user
                    return res.status(400).json({ success: false, message: 'A user exists with the given email!' });
                }
                else { // updating an user
                    if (users[0].id !== parseInt(id)) {
                        // another user having the same name
                        return res.status(400).json({ success: false, message: 'A user exists with the given email!' });
                    }
                }
            }
            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the users failed!' });
        }
    },

    checkRoleIntegrityError: async (req, res, next) => {
        const { roleId } = req.body;

        try {
            // load the role
            const role = await userHelpers.getRole(roleId);

            if (role === null) { 
                return res.status(400).json({ success: false, message: 'An invalid role given!' });
            }
            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the role failed!' });
        }
    }, 

    checkEmptyCredentials: (req, res, next) => {
        // get input fields
        const { email, password } = req.body;

        const emptyFields = [];

        if (email === null || email === undefined || email === '') {
            emptyFields.push('email');
        }
        if (password === null || password === undefined || password === '') {
            emptyFields.push('password');
        }

        if (emptyFields.length > 0) {
            // empty field(s) exist(s)
            return res.status(400).json({ success: false, fields: emptyFields, message: 'Fields cannot be empty' });
        }

        next();
    },
};