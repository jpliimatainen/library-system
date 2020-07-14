const helpers = require('../helpers/customer.helpers');

module.exports = {

    checkCustomerIdMismatch: (req, res, next) => {
        // get the customer ids
        const id = req.params.customerId;
        const { customerId } = req.body;

        if (parseInt(id) !== customerId) {
            // ids not match
            res.status(400).json({ success: false, message: 'Customer ids not match.' });
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
        // get the customer id (if set)
        const id = req.params.customerId || null;

        try {
            // load the customer with the email
            const customers = await helpers.getCustomerByEmail(email);

            if (customers.length > 0) {
                if (id === null) { // inserting a new customer
                    res.status(400).json({ success: false, message: 'A customer exists with the given email!' });
                    return;
                }
                else { // updating a customer
                    if (customers[0].id !== parseInt(id)) {
                        // another customer having the same email
                        res.status(400).json({ success: false, message: 'A customer exists with the given email!' });
                        return;
                    }
                }
            }
            next();
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'Fetching the customers failed!' });
        }
    }
};