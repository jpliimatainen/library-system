const bcrypt = require('bcryptjs');

const dbQuery = require('../models/db.model');
const commonHelpers = require('../helpers/common.helpers');

const Role = require('../models/Role');
const User = require('../models/User');

const insertUser = user => {
    const { email, password, roleId } = user;

    const query = "INSERT INTO  users(email, password, role_id) VALUES(?, ?, ?)";

    // execute an insert query
    return dbQuery(query, [email, password, roleId]);
};

const getUsersByParams = (id, email, roleId) => {
    const params = [];

    let query = "SELECT user_id AS 'userId', email, password, created_at AS 'createdAt', "
        + "updated_at AS 'updatedAt', role_id AS 'roleId' FROM users WHERE 1 = 1";

    if (id !== null && id !== undefined) {
        query += " AND user_id = ?";
        params.push(id);
    }

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
    const { email, password, roleId, id } = user;

    const query = "UPDATE users SET email = ?, password = ?, updated_at ="
        + " CURRENT_TIMESTAMP(), role_id = ? WHERE user_id = ?";

    // execute an update query
    return dbQuery(query, [email, password, roleId, id]);
};

const removeUser = id => {
    const query = "DELETE FROM users WHERE user_id = ?";

    // execute a delete query
    return dbQuery(query, [id]);
};

const getRoleById = id => {
    const query = "SELECT role_id AS 'roleId', name, created_at AS 'createdAt', "
        + "updated_at AS 'updatedAt' FROM roles WHERE role_id = ?";

    // execute a select query
    return dbQuery(query, [id]);
};

const getUserWithPassword = email => {
    const query = "SELECT user_id AS 'userId', email, password, created_at AS 'createdAt', "
        + "updated_at AS 'updatedAt', role_id AS 'roleId' FROM users WHERE email = ?";

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
        result = await getUsersByParams(result.insertId, null, null);
        const created = result[0];

        // get the role of the user
        result = await getRoleById(created.roleId);
        const role = result[0];

        return new User(
            created.userId,
            created.email,
            null,
            created.createdAt,
            created.updatedAt,
            created.roleId,
            new Role(
                role.roleId,
                role.name,
                role.createdAt,
                role.updatedAt
            ),
            null
        );
    },

    getUser: async id => {
        // load the requested user
        let result = await getUsersByParams(id, null, null);
        const loaded = result[0];

        // get the role of the user
        result = await getRoleById(loaded.roleId);
        const role = result[0];

        return new User(
            loaded.userId,
            loaded.email,
            null,
            loaded.createdAt,
            loaded.updatedAt,
            loaded.roleId,
            new Role(
                role.roleId,
                role.name,
                role.createdAt,
                role.updatedAt
            ),
            null
        );
    },

    getRole: async roleId => {
        const result = await getRoleById(roleId);

        if (result.length > 0) {
            return new Role(
                result[0].roleId,
                result[0].name,
                result[0].createdAt,
                result[0].updatedAt
            );
        }

        // not a role found
        return null;
    },

    getUsers: async (email, roleId) => {
        // load the requested users
        const result = await getUsersByParams(null, email, roleId);
        const users = [];
        let role = {};

        await commonHelpers.asyncForEach(result, async element => {
            // get the role of the user
            role = await getRoleById(element.roleId);

            users.push(
                new User(
                    element.userId,
                    element.email,
                    null,
                    element.createdAt,
                    element.updatedAt,
                    element.roleId,
                    new Role(
                        role[0].roleId,
                        role[0].name,
                        role[0].createdAt,
                        role[0].updatedAt
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
            result = await getUsersByParams(user.id, null, null);
            const updated = result[0];

            // get the role of the user
            const role = await getRoleById(updated.roleId);

            return new User(
                updated.userId,
                updated.email,
                null,
                updated.createdAt,
                updated.updatedAt,
                updated.roleId,
                new Role(
                    role[0].roleId,
                    role[0].name,
                    role[0].createdAt,
                    role[0].updatedAt
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
        if (!(await compareWithHashed(password, loaded.password))) {
            // passwords not match
            return null;
        }

        // get the role of the user
        result = await getRoleById(loaded.roleId);
        const role = result[0];

        return new User(
            loaded.userId,
            loaded.email,
            null,
            loaded.createdAt,
            loaded.updatedAt,
            loaded.roleId,
            new Role(
                role.roleId,
                role.name,
                role.createdAt,
                role.updatedAt
            ),
            null
        );
    }
};