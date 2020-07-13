const bcrypt = require('bcryptjs');

const helpers = require('../helpers/user.helpers');
const User = require('../models/User');

// create a hashed password
const hashed = (password, saltRounds) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(hash);
                }
            });
        });
    });
};

module.exports = {

    createUser: async (req, res) => {
        // get POST data
        const { email, password, roleId } = req.body;

        // create a hashed password
        const hashedPw = await hashed(password, 10);

        const inputUser = new User(
            null,
            email,
            hashedPw,
            null,
            null,
            roleId,
            null,
            null
        );
        
        try {
            // create a new user
            const outputUser = await helpers.createUser(inputUser);

            res.status(201).json({ success: true, data: outputUser });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Creating an user failed!' });
        }
    },

    getUser: async (req, res) => {
        // get the user id
        const id = req.params.userId;

        try {
            // load the requested user
            const user = await helpers.getUser(id);

            res.json({ success: true, data: user });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the user failed!' });
        }
    },

    getUsers: async (req, res) => {
        // get query parameteres
        const { email, roleId } = req.query;

        try {
            // load the requested users
            const users = await helpers.getUsers(email, roleId);

            res.json({ success: true, data: users });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the users failed!' });
        }
    },

    updateUser: async (req, res) => {
        // get the user id
        const id = req.params.userId;

        // get PUT data
        const { email, password, roleId } = req.body;

        // create a hashed password
        const hashedPw = await hashed(password, 10);

        const inputUser = new User(
            id,
            email,
            hashedPw,
            null,
            null,
            roleId,
            null,
            null
        );

        try {
            // update the user
            const outputUser = await helpers.updateUser(inputUser);

            if (outputUser === null) { // no affected rows
                res.status(400).json({ success: false, message: 'No users updated.' });
            }
            else {
                res.json({ status: 'OK', data: outputUser });
            }
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Updating the user failed!' });
        }
    },

    deleteUser: async (req, res) => {
        // get the user id
        const id = req.params.userId;

        try {
            // delete the requested user
            const result = await helpers.deleteUser(id);

            if (result === 0) { // no affected rows
                res.status(400).json({ success: false, message: 'No users deleted.' });
            }
            else {
                res.json({ success: true, message: `User with the id ${id} deleted.` });
            }
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Deleting the user failed!' });
        }
    }
};