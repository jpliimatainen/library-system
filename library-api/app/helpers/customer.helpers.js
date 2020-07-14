const dbQuery = require('../models/db.model');
const commonHelpers = require('../helpers/common.helpers');
const userHelpers = require('../helpers/user.helpers');
const Customer = require('../models/Customer');

const insertCustomer = customer => {
    const query = "INSERT INTO  customers(firstname, lastname, street_address, "
        + "post_code, user_id) VALUES(?, ?, ?, ?, ?, ?)";

    // execute an insert query
    return dbQuery(query, [customer.firstname, customer.lastname,
    customer.streetAddress, customer.postCode, customer.userId]);
};

const getCustomerById = id => {
    const query = "SELECT customer_id, firstname, lastname, street_address, post_code, " 
        + "created_at, updated_at, user_id FROM customers WHERE customer_id = ?";

    // execute a select query
    return dbQuery(query, [id]);
};

const getCustomersByParams = (email, firstname, lastname, streetAddress, postCode) => {
    const params = [];

    let query = "SELECT c.customer_id AS 'customer_id', c.firstname AS 'firstname', c.lastname AS 'lastname', "
        + "c.street_address AS 'street_address', c.post_code AS 'post_code', c.created_at AS 'created_at', "
        + "c.updated_at AS 'updated_at' FROM customers c JOIN users u ON c.user_id = u.user_id WHERE 1 = 1";

    if (email !== null && email !== undefined) {
        query += " AND UPPER(u.email) LIKE ?";
        params.push('%' + email.toUpperCase() + '%');
    }
    if (firstname !== null && firstname !== undefined) {
        query += " AND UPPER(c.firstname) LIKE ?";
        params.push('%' + firstname.toUpperCase() + '%');
    }
    if (lastname !== null && lastname !== undefined) {
        query += " AND UPPER(c.lastname) LIKE ?";
        params.push('%' + lastname.toUpperCase() + '%');
    }
    if (streetAddress !== null && streetAddress !== undefined) {
        query += " AND UPPER(c.street_address) LIKE ?";
        params.push('%' + streetAddress.toUpperCase() + '%');
    }
    if (postCode !== null && postCode !== undefined) {
        query += " AND c.post_code = ?";
        params.push(postCode);
    }

    // execute a select query
    return dbQuery(query, params);
};

const editCustomer = customer => {
    const query = "UPDATE customers SET firstname = ?, lastname = ?, street_address = ?, "
        + "post_code = ?, updated_at = CURRENT_TIMESTAMP() WHERE customer_id = ?";

    // execute an update query
    return dbQuery(query, [customer.firstname, customer.lastname, customer.streetAddress,
    customer.postCode, customer.id]);
};

const removeCustomer = id => {
    const query = "DELETE FROM customers WHERE customer_id = ?";

    // execute a delete query
    return dbQuery(query, [id]);
};

module.exports = {

    createCustomer: async customer => {
        // create a new customer
        let result = await insertCustomer(customer);

        // load the created customer
        result = await getCustomerById(result.insertId);
        const created = result[0];

        // get the user object of the customer
        const user = await userHelpers.getUser(created.user_id);

        return new Customer(
            created.customer_id,
            created.firstname,
            created.lastname,
            created.streetAddress,
            created.postCode,
            created.created_at,
            created.updated_at,
            created.user_id,
            user[0]
        );
    },

    getCustomer: async id => {
        // load the requested customer
        const result = await getCustomerById(id);
        const loaded = result[0];

        // get the user object of the customer
        const user = await userHelpers.getUser(loaded.user_id);

        return new Customer(
            loaded.customer_id,
            loaded.firstname,
            loaded.lastname,
            loaded.streetAddress,
            loaded.postCode,
            loaded.created_at,
            loaded.updated_at,
            loaded.user_id,
            user[0]
        );
    },

    getCustomerByEmail: async email => {
        // load the requested customers
        const result = await getCustomersByParams(email);
        const loaded = result[0];

        // get the user object of the customer
        const user = await userHelpers.getUser(loaded.user_id);

        return new Customer(
            loaded.customer_id,
            loaded.firstname,
            loaded.lastname,
            loaded.streetAddress,
            loaded.postCode,
            loaded.created_at,
            loaded.updated_at,
            loaded.user_id,
            user[0]
        );
    },

    getCustomers: async (email, firstname, lastname, streetAddress, postCode) => {
        // load the requested customers
        const result = await getCustomersByParams(email, firstname, lastname, streetAddress, postCode);
        const customers = [];
        let user = {};

        await commonHelpers.asyncForEach(result, async element => {
            // get the user object of the customer
            user = await userHelpers.getUser(element.user_id);

            customers.push(
                new Customer(
                    element.customer_id,
                    element.firstname,
                    element.lastname,
                    element.streetAddress,
                    element.postCode,
                    element.created_at,
                    element.updated_at,
                    element.user_id,
                    user[0]
                )
            );
        });

        return customers;
    },

    updateCustomer: async customer => {
        // update the customer
        let result = await editCustomer(customer);

        if (result.affectedRows === 0) { // no affected rows
            return null;
        }
        else {
            // load the updated customer
            result = await getCustomerById(customer.id);
            const updated = result[0];

            // get the user object of the customer
            const user = await userHelpers.getUser(updated.user_id);

            return new Customer(
                updated.customer_id,
                updated.firstname,
                updated.lastname,
                updated.streetAddress,
                updated.postCode,
                updated.created_at,
                updated.updated_at,
                updated.user_id,
                user[0]
            );
        }
    },

    deleteCustomer: async id => {
        // load the customer
        const customer = await getCustomerById(id);

        // delete the requested customer
        let result = await removeCustomer(id);

        // delete the user
        result = await userHelpers.deleteUser(customer.user_id);

        return result.affectedRows;
    }
};