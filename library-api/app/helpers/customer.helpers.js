const dbQuery = require('../models/db.model');

const commonHelpers = require('../helpers/common.helpers');
const userHelpers = require('../helpers/user.helpers');

const Customer = require('../models/Customer');
const Post = require('../models/Post');

const insertCustomer = customer => {
    const { firstname, lastname, streetAddress, userId, postCode } = customer;

    const query = "INSERT INTO  customers(firstname, lastname, street_address, user_id, post_code)"
        + " VALUES(?, ?, ?, ?, ?)";

    // execute an insert query
    return dbQuery(query, [firstname, lastname, streetAddress, userId, postCode]);
};

const getCustomerById = id => {
    const query = "SELECT customer_id AS 'customerId', firstname, lastname, street_address AS 'streetAdress', created_at AS 'createdAt', "
        + "updated_at AS 'updatedAt', user_id AS 'userId', post_code AS 'postCode' FROM customers WHERE customer_id = ?";

    // execute a select query
    return dbQuery(query, [id]);
};

const getCustomersByParams = (email, firstname, lastname, streetAddress, postCode) => {
    const params = [];

    let query = "SELECT c.customer_id AS 'customerId', c.firstname AS 'firstname', c.lastname AS 'lastname', c.street_address AS "
        + "'streetAddress', c.created_at AS 'createdAt', c.updated_at AS 'updatedAt', c.user_id AS 'userId', c.post_code AS 'postCode' "
        + "FROM customers c JOIN users u ON c.user_id = u.user_id WHERE 1 = 1";

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
        query += " AND post_code = ?";
        params.push(postCode);
    }

    // execute a select query
    return dbQuery(query, params);
};

const editCustomer = customer => {
    const { firstname, lastname, streetAddress, postCode, id } = customer;
    
    const query = "UPDATE customers SET firstname = ?, lastname = ?, street_address = ?, post_code = ?, "
        + "updated_at = CURRENT_TIMESTAMP() WHERE customer_id = ?";

    // execute an update query
    return dbQuery(query, [firstname, lastname, streetAddress, postCode, id]);
};

const removeCustomer = id => {
    const query = "DELETE FROM customers WHERE customer_id = ?";

    // execute a delete query
    return dbQuery(query, [id]);
};

const getPostByCode = postCode => {
    const query = "SELECT post_code AS 'postCode', town FROM posts WHERE post_code = ?";

    // execute a select query
    return dbQuery(query, [postCode]);
};

const getUserIdByCustomerId = customerId => {
    const query = "SELECT user_id AS 'userId' FROM customers WHERE customer_id = ?";

    // execute a select query
    return dbQuery(query, [customerId]);
};

module.exports = {

    createCustomer: async customer => {
        const { email, password, roleId } = customer.user;

        // create a password hashed user object
        const inputUser = await userHelpers.createHashedUser(email, password, roleId);

        // create a new user
        const outputUser = await userHelpers.createUser(inputUser);

        // attach the user id to the customer
        customer.userId = outputUser.id;

        // create a new customer
        let result = await insertCustomer(customer);

        // load the created customer
        result = await getCustomerById(result.insertId);
        const created = result[0];

        // get the post object of the customer
        result = await getPostByCode(created.postCode);
        const post = result[0];

        return new Customer(
            created.customerId,
            created.firstname,
            created.lastname,
            created.streetAddress,
            created.createdAt,
            created.updatedAt,
            created.userId,
            outputUser,
            created.postCode,
            new Post(
                post.postCode,
                post.town
            )
        );
    },

    getCustomer: async id => {
        // load the requested customer
        let result = await getCustomerById(id);
        const loaded = result[0];

        // get the user object of the customer
        const user = await userHelpers.getUser(loaded.userId);

        // get the post object of the customer
        result = await getPostByCode(loaded.postCode);
        const post = result[0];

        return new Customer(
            loaded.customerId,
            loaded.firstname,
            loaded.lastname,
            loaded.streetAddress,
            loaded.createdAt,
            loaded.updatedAt,
            loaded.userId,
            user,
            loaded.postCode,
            new Post(
                post.postCode,
                post.town
            )
        );
    },

    getCustomers: async (email, firstname, lastname, streetAddress, postCode) => {
        // load the requested customers
        let result = await getCustomersByParams(email, firstname, lastname, streetAddress, postCode);

        const customers = [];
        let user, post = {};

        await commonHelpers.asyncForEach(result, async element => {
            // get the user object of the customer
            user = await userHelpers.getUser(element.userId);

            // get the post object of the customer
            result = await getPostByCode(element.postCode);
            post = result[0];

            customers.push(
                new Customer(
                    element.customerId,
                    element.firstname,
                    element.lastname,
                    element.streetAddress,
                    element.createdAt,
                    element.updatedAt,
                    element.userId,
                    user,
                    element.postCode,
                    new Post(
                        post.postCode,
                        post.town
                    )
                )
            );
        });

        return customers;
    },

    updateCustomer: async customer => {
        const { email, password, roleId } = customer.user;
        
        // create a password hashed user object
        const inputUser = await userHelpers.createHashedUser(email, password, roleId);

        // get the user id of the customer
        let result = await getUserIdByCustomerId(customer.id);
        inputUser.id = result[0].userId;

        // update the user
        const outputUser = await userHelpers.updateUser(inputUser);

        // update the customer
        result = await editCustomer(customer);
        
        if (result.affectedRows === 0) { // no affected rows
            return null;
        }
        else {
            // load the updated customer
            result = await getCustomerById(customer.id);
            const updated = result[0];

            // get the post object of the customer
            result = await getPostByCode(updated.postCode);
            const post = result[0];

            return new Customer(
                updated.customerId,
                updated.firstname,
                updated.lastname,
                updated.streetAddress,
                updated.createdAt,
                updated.updatedAt,
                updated.userId,
                outputUser,
                updated.postCode,
                new Post(
                    post.postCode,
                    post.town
                )
            );
        }
    },

    deleteCustomer: async id => {
        let count = 0;

        // get the user id of the customer
        let result = await getUserIdByCustomerId(id);
        const userId = result[0].userId;

        // delete the requested customer
        result = await removeCustomer(id);
        count = parseInt(result.affectedRows);
        
        // delete the user
        result = await userHelpers.deleteUser(userId);
        count += parseInt(result.affectedRows);

        return count;
    },

    getPost: async postCode => {
        const result = await getPostByCode(postCode);

        if (result.length > 0) {
            return new Post(
                result[0].postCode,
                result[0].town
            );
        }

        // no post code found
        return null;
    },
};