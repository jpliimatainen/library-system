const dbQuery = require('../models/db.model');
const commonHelpers = require('../helpers/common.helpers');
const User = require('../models/User');

const insertUser = user => {
    const query = "INSERT INTO  users(email, password, role_id) VALUES(?, ?, ?)";

    // execute an insert query
    return dbQuery(query, [user.email, user.password, user.roleId]);
};

const getUserById = id => {
    const query = "SELECT user_id, email, password, created_at, updated_at, role_id"
        + " FROM users WHERE user_id = ?";

    // execute a select query
    return dbQuery(query, [id]);
};

const getUsersByParams = (email, roleId) => {
    const params = [];

    let query = "SELECT user_id, email, created_at, updated_at, role_id FROM users WHERE 1 = 1";

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

const editUser = user => {
    const query = "UPDATE users SET email = ?, password = ?, updated_at =" 
        + " CURRENT_TIMESTAMP(), role_id = ? WHERE user_id = ?";
    
    // execute an update query
    return dbQuery(query, [user.email, user.password, user.roleId, user.id]);
};

const removeUser = id => {
    const query = "DELETE FROM users WHERE user_id = ?";

    // execute a delete query
    return dbQuery(query, [id]);
};

const getRoleById = id => {
    const query = "SELECT role_id, name, created_at, updated_at FROM roles WHERE role_id = ?";

    // execute a select query
    return dbQuery(query, [id]);
};

module.exports = {

    createUser: async user => {
        // create a new user
        let result = await insertUser(user);

        // load the created user
        result = await getUserById(result.insertId);
        const created = result[0];

        // get the role of the user
        const role = await getRoleById(created.role_id);

        return new User(
            created.user_id,
            created.email,
            null,
            created.created_at,
            created.updated_at,
            created.role_id,
            role[0],
            null
        );
    },

    getUser: async id => {
        // load the requested user
        const result = await getUserById(id);
        const loaded = result[0];

        // get the role of the user
        const role = await getRoleById(loaded.role_id);

        return new User(
            loaded.user_id,
            loaded.email,
            null,
            loaded.created_at,
            loaded.updated_at,
            loaded.role_id,
            role[0],
            null
        );
    },

    getUsers: async (email, roleId) => {
        // load the requested users
        const result = await getUsersByParams(email, roleId);
        const users = [];
        let role = {};

        await commonHelpers.asyncForEach(result, async element => {
            // get the role of the user
            role = await getRoleById(element.role_id);

            users.push(
                new User(
                    element.user_id,
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

        return users;
    },

    updateUser: async user => {
        // update the user
        let result = await editUser(user);

        if (result.affectedRows === 0) { // no affected rows
            return null;
        }
        else {
            // load the updated user
            result = await getUserById(user.id);
            const updated = result[0];

            // get the role of the user
            const role = await getRoleById(updated.role_id);

            return new User(
                updated.user_id,
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

    deleteUser: async id => {
        // delete the requested user
        const result = await removeUser(id);

        return result.affectedRows;
    }
};