const jwt = require('jsonwebtoken');

const { secret } = require('../config/env.config');
const helpers = require('../helpers/user.helpers');

module.exports = {

    createUser: async (req, res) => {
        // get POST data
        const { email, password, roleId } = req.body;

        try {
            // create a password hashed user object
            const inputUser = await helpers.createHashedUser(email, password, roleId);

            // create a new user
            const outputUser = await helpers.createUser(inputUser);

            return res.status(201).json({ success: true, data: outputUser });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Creating an user failed!' });
        }
    },

    getUser: async (req, res) => {
        // get the user id
        const id = req.params.userId;

        try {
            // load the requested user
            const user = await helpers.getUser(id);

            return res.json({ success: true, data: user });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the user failed!' });
        }
    },

    getUsers: async (req, res) => {
        // get query parameteres
        const { email, roleId } = req.query;
        
        try {
            // load the requested users
            const users = await helpers.getUsers(email, roleId);

            return res.json({ success: true, data: users });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the users failed!' });
        }
    },

    updateUser: async (req, res) => {
        // get the user id
        const id = req.params.userId;

        // get PUT data
        const { email, password, roleId } = req.body;

        try {
            // create a password hashed user object
            const inputUser = await helpers.createHashedUser(email, password, roleId);
            inputUser.id = id;

            // update the user
            const outputUser = await helpers.updateUser(inputUser);

            if (outputUser === null) { // no affected rows
                return res.status(400).json({ success: false, message: 'No users updated.' });
            }

            return res.json({ status: 'OK', data: outputUser });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Updating the user failed!' });
        }
    },

    deleteUser: async (req, res) => {
        // get the user id
        const id = req.params.userId;

        try {
            // delete the requested user
            const result = await helpers.deleteUser(id);

            if (result === 0) { // no affected rows
                return res.status(400).json({ success: false, message: 'No users deleted.' });
            }

            return res.json({ success: true, message: `User with the id ${id} deleted.` });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Deleting the user failed!' });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            // check if valid credentials entered
            const user = await helpers.login(email, password);

            if (user === null) {
                return res.status(403).json({ success: false, message: 'Incorrect email or password!' });
            }

            // create a JWT
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                secret,
                { expiresIn: '1h' }
            );

            // attach the token to the user object
            user.token = token;

            return res.json({ success: true, user: user, message: 'Login succeeded!' });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Login failed!' });
        }
    }
};