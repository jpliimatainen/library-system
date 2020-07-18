const customerHelpers = require('../helpers/customer.helpers');

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

    checkEmptyFields: (req, res, next) => {
        // get input fields
        const { email, password, passwordConfirmed, firstname, lastname, streetAddress, postCode } = req.body;

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
        if (firstname === null || firstname === undefined || firstname === '') {
            emptyFields.push('firstname');
        }
        if (lastname === null || lastname === undefined || lastname === '') {
            emptyFields.push('lastname');
        }
        if (streetAddress === null || streetAddress === undefined || streetAddress === '') {
            emptyFields.push('streetAddress');
        }
        if (postCode === null || postCode === undefined || postCode === '') {
            emptyFields.push('postCode');
        }

        if (emptyFields.length > 0) {
            // empty field(s) exist(s)
            return res.status(400).json({ success: false, fields: emptyFields, message: 'Fields cannot be empty' });
        }

        next();
    },

    checkPostCodeIntegrityError: async (req, res, next) => {
        const { postCode } = req.body;

        try {
            // load the post object
            const post = await customerHelpers.getPost(postCode);

            if (post === null) { 
                return res.status(400).json({ success: false, message: 'An invalid post code given!' });
            }
            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the post code failed!' });
        }
    }, 
};