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
    const query = "SELECT firstname, lastname, street_address, post_code, created_at, " 
        + "updated_at, user_id FROM customers WHERE customer_id = ?";

    // execute a select query
    return dbQuery(query, [id]);
};

const getCustomersByParams = (email, roleId) => {
    const params = [];

    let query = "SELECT customer_id, email, created_at, updated_at, role_id FROM customers WHERE 1 = 1";

    if (email !== null && email !== undefined) {
        query += " AND UPPER(email) LIKE ?";
        params.push('%' + email.toUpperCase() + '%');
    }
    if (roleId !== null && roleId !== undefined) {
        query += " AND role_id = ?";
        params.push(roleId);
    }

    // execute a select query
    return dbQuery(query, params);
};

const editCustomer = customer => {
    const query = "UPDATE customers SET email = ?, password = ?, updated_at =" 
        + " CURRENT_TIMESTAMP(), role_id = ? WHERE customer_id = ?";
    
    // execute an update query
    return dbQuery(query, [customer.email, customer.password, customer.roleId, customer.id]);
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

        // get the role of the customer
        const role = await getRoleById(loaded.role_id);

        return new Customer(
            loaded.customer_id,
            loaded.email,
            null,
            loaded.created_at,
            loaded.updated_at,
            loaded.role_id,
            role[0],
            null
        );
    },

    getCustomers: async (email, roleId) => {
        // load the requested customers
        const result = await getCustomersByParams(email, roleId);
        const customers = [];
        let role = {};

        await commonHelpers.asyncForEach(result, async element => {
            // get the role of the customer
            role = await getRoleById(element.role_id);

            customers.push(
                new Customer(
                    element.customer_id,
                    element.email,
                    null,
                    element.created_at,
                    element.updated_at,
                    element.role_id,
                    role[0],
                    null
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

            // get the role of the customer
            const role = await getRoleById(updated.role_id);

            return new Customer(
                updated.customer_id,
                updated.email,
                null,
                updated.created_at,
                updated.updated_at,
                updated.role_id,
                role[0],
                null
            );
        }
    },

    deleteCustomer: async id => {
        // delete the requested customer
        const result = await removeCustomer(id);

        return result.affectedRows;
    }
};