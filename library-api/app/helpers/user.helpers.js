const bcrypt = require('bcryptjs');

const dbQuery = require('../models/db.model');
const commonHelpers = require('../helpers/common.helpers');

const Role = require('../models/Role');
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

const getUserWithPassword = email => {
    const query = "SELECT user_id, email, password, created_at, " 
        + "updated_at, role_id FROM users WHERE email = ?";

    // execute a select query
    return dbQuery(query, [email]);
}

// create a hashed password
const hashed = (password, saltRounds) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
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

// compare an input password with a hashed one
const compareWithHashed = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function (err, res) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};

module.exports = {

    createHashedUser: async (email, password, roleId) => {
        // create a hashed password
        const hashedPw = await hashed(password, 10);

        return new User(
            null,
            email,
            hashedPw,
            null,
            null,
            roleId,
            null,
            null
        );
    },

    createUser: async user => {
        // create a new user
        let result = await insertUser(user);

        // load the created user
        result = await getUserById(result.insertId);
        const created = result[0];

        // get the role of the user
        result = await getRoleById(created.role_id);
        const role = result[0];

        return new User(
            created.user_id,
            created.email,
            null,
            created.created_at,
            created.updated_at,
            created.role_id,
            new Role(
                role.role_id,
                role.name,
                role.created_at,
                role.updated_at
            ),
            null
        );
    },

    getUser: async id => {
        // load the requested user
        let result = await getUserById(id);
        const loaded = result[0];

        // get the role of the user
        result = await getRoleById(loaded.role_id);
        const role = result[0];

        return new User(
            loaded.user_id,
            loaded.email,
            null,
            loaded.created_at,
            loaded.updated_at,
            loaded.role_id,
            new Role(
                role.role_id,
                role.name,
                role.created_at,
                role.updated_at
            ),
            null
        );
    },

    getRole: async roleId => {
        const result = await getRoleById(roleId);

        if (result.length > 0) {
            return new Role(
                result[0].role_id,
                result[0].name,
                result[0].created_at,
                result[0].updated_at
            );
        }

        // not a role found
        return null;
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
                    new Role(
                        role[0].role_id,
                        role[0].name,
                        role[0].created_at,
                        role[0].updated_at
                    ),
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
                new Role(
                    role[0].role_id,
                    role[0].name,
                    role[0].created_at,
                    role[0].updated_at
                ),
                null
            );
        }
    },

    deleteUser: async id => {
        // delete the requested user
        const result = await removeUser(id);

        return result.affectedRows;
    },

    login: async (email, password) => {
        let result = await getUserWithPassword(email);

        if (result.length === 0) { // user not found
            return null;
        }

        const loaded = result[0];
        if (!compareWithHashed(password, loaded.password)) {
            // passwords not match
            return null;
        }

        // get the role of the user
        result = await getRoleById(loaded.role_id);
        const role = result[0];

        return new User(
            loaded.user_id,
            loaded.email,
            null,
            loaded.created_at,
            loaded.updated_at,
            loaded.role_id,
            new Role(
                role.role_id,
                role.name,
                role.created_at,
                role.updated_at
            ),
            null
        );
    }
};