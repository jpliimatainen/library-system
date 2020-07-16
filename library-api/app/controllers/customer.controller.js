const customerHelpers = require('../helpers/customer.helpers');
const userHelpers = require('../helpers/user.helpers');
const Customer = require('../models/Customer');

module.exports = {

    createCustomer: async (req, res) => {
        // get POST data
        const { email, password, firstname, lastname, streetAddress, postCode } = req.body;

        try {
            // create a password hashed user object
            const inputUser = await userHelpers.createHashedUser(email, password, 2);

            // create a new user
            const outputUser = await userHelpers.createUser(inputUser);

            const inputCustomer = new Customer(
                null,
                firstname,
                lastname,
                streetAddress,
                postCode,
                null,
                null,
                outputUser.userId,
                null
            );

            // create a new customer
            const outputCustomer = await customerHelpers.createCustomer(inputCustomer);

            return res.status(201).json({ success: true, data: outputCustomer });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Creating a customer failed!' });
        }
    },

    getCustomer: async (req, res) => {
        // get the customer id
        const id = req.params.customerId;

        try {
            // load the requested customer
            const customer = await helpers.getCustomer(id);

            return res.json({ success: true, data: customer });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the customer failed!' });
        }
    },

    getCustomers: async (req, res) => {
        // get query parameteres
        const { email, roleId } = req.query;

        try {
            // load the requested customers
            const customers = await helpers.getCustomers(email, roleId);

            return res.json({ success: true, data: customers });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the customers failed!' });
        }
    },

    updateCustomer: async (req, res) => {
        // get the customer id
        const id = req.params.customerId;

        // get PUT data
        const { email, password, firstname, lastname, streetAddress, postCode } = req.body;

        try {
            // create a password hashed user object
            const inputUser = await userHelpers.createHashedUser(email, password, 2);

            // update the user
            const outputUser = await userHelpers.updateUser(inputUser);

            const inputCustomer = new Customer(
                id,
                firstname,
                lastname,
                streetAddress,
                postCode,
                null,
                null,
                outputUser.userId,
                null
            );

            // update the customer
            const outputCustomer = await helpers.updateCustomer(inputCustomer);

            if (outputCustomer === null) { // no affected rows
                return res.status(400).json({ success: false, message: 'No customers updated.' });
            }

            return res.json({ status: 'OK', data: outputCustomer });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Updating the customer failed!' });
        }
    },

    deleteCustomer: async (req, res) => {
        // get the customer id
        const id = req.params.customerId;

        try {
            // delete the requested customer
            const result = await helpers.deleteCustomer(id);

            if (result === 0) { // no affected rows
                return res.status(400).json({ success: false, message: 'No customers deleted.' });
            }

            return res.json({ success: true, message: `Customer with the id ${id} deleted.` });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Deleting the customer failed!' });
        }
    }
};