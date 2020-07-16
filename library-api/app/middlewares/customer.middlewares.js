const helpers = require('../helpers/customer.helpers');

module.exports = {

    checkCustomerIdMismatch: (req, res, next) => {
        // get the customer ids
        const id = req.params.customerId;
        const { customerId } = req.body;

        if (parseInt(id) !== customerId) {
            // ids not match
            return res.status(400).json({ success: false, message: 'Customer ids not match.' });
        }

        next();
    },

    checkPasswordMismatch: (req, res, next) => {
        const { password, passwordConfirmed } = req.body;

        if (password !== passwordConfirmed) {
            return res.status(400).json({ success: false, message: 'Given passwords do not match!' });
        }

        next();
    },

    checkDuplicateEmail: async (req, res, next) => {
        const { email } = req.body;
        // get the customer id (if set)
        const id = req.params.customerId || null;

        try {
            // load the customer with the email
            const customers = await helpers.getCustomerByEmail(email);

            if (customers.length > 0) {
                if (id === null) { // inserting a new customer
                    return res.status(400).json({ success: false, message: 'A customer exists with the given email!' });
                }
                else { // updating a customer
                    if (customers[0].id !== parseInt(id)) {
                        // another customer having the same email
                        return res.status(400).json({ success: false, message: 'A customer exists with the given email!' });
                    }
                }
            }
            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the customers failed!' });
        }
    }
};