const helpers = require('../helpers/customer.helpers');

const Customer = require('../models/Customer');
const User = require('../models/User');

module.exports = {

    createCustomer: async (req, res) => {
        // get POST data
        const { firstname, lastname, streetAddress, postCode, email, password } = req.body;

        const inputCustomer = new Customer(
            null,
            firstname,
            lastname,
            streetAddress,
            null,
            null,
            null,
            new User(
               null,
               email,
               password,
               null,
               null,
               2, // customer role
               null,
               null 
            ),
            postCode,
            null
        );

        try {
            // create a new customer
            const outputCustomer = await helpers.createCustomer(inputCustomer);

            return res.status(201).json({ success: true, data: outputCustomer });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Creating an customer failed!' });
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
        const { email, firstname, lastname, streetAddress, postCode } = req.query;

        try {
            // load the requested customers
            const customers = await helpers.getCustomers(email, firstname, lastname, streetAddress, postCode);

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
        const { firstname, lastname, streetAddress, postCode, email, password } = req.body;

        const inputCustomer = new Customer(
            null,
            firstname,
            lastname,
            streetAddress,
            null,
            null,
            null,
            new User(
               null,
               email,
               password,
               null,
               null,
               2, // customer role
               null,
               null 
            ),
            postCode,
            null
        );

        try {
            // update the customer
            const outputCustomer = await helpers.updateCustomer(inputCustomer);

            if (outputCustomer === null) { // no affected rows
                return res.status(400).json({ success: false, message: 'No customers updated.' });
            }

            return res.json({ success: true, data: outputCustomer });
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