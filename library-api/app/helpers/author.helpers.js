const dbQuery = require('../models/db.model');
const Author = require('../models/Author');

const insertAuthor = author => {
    const query = "INSERT INTO  authors(firstname, lastname) VALUES(?, ?)";

    // execute an insert query
    return dbQuery(query, [author.firstname, author.lastname]);
};

const getAuthorById = id => {
    const query = "SELECT author_id, firstname, lastname, created_at, updated_at FROM "
        + "authors WHERE author_id = ?";

    // execute a select query
    return dbQuery(query, [id]);
};

const getAuthorsByParams = (firstname, lastname) => {
    const params = [];

    let query = "SELECT author_id, firstname, lastname, created_at, updated_at "
        + "FROM authors WHERE 1 = 1";

    if (firstname !== null && firstname !== undefined) {
        query += " AND UPPER(firstname) LIKE ?";
        params.push('%' + firstname.toUpperCase() + '%');
    }
    if (lastname !== null && lastname !== undefined) {
        query += " AND UPPER(lastname) LIKE ?";
        params.push('%' + lastname.toUpperCase() + '%');
    }

    // execute a select query
    return dbQuery(query, params);
};

const editAuthor = author => {
    const query = "UPDATE authors SET firstname = ?, lastname = ?, "
        + "updated_at = CURRENT_TIMESTAMP() WHERE author_id = ?";

    // execute an update query
    return dbQuery(query, [author.firstname, author.lastname, author.id]);
};

const removeAuthor = id => {
    const query = "DELETE FROM authors WHERE author_id = ?";

    // execute a delete query
    return dbQuery(query, [id]);
};

module.exports = {

    createAuthor: async author => {
        // create a new author
        let result = await insertAuthor(author);

        // load the created author
        result = await getAuthorById(result.insertId);
        const created = result[0];

        return new Author(
            created.author_id,
            created.firstname,
            created.lastname,
            created.created_at,
            created.updated_at
        );
    },

    getAuthor: async id => {
        // load the requested author
        const result = await getAuthorById(id);
        const loaded = result[0];

        return new Author(
            loaded.author_id,
            loaded.firstname,
            loaded.lastname,
            loaded.created_at,
            loaded.updated_at
        );
    },

    getAuthors: async (firstname, lastname) => {
        // load the requested authors
        const result = await getAuthorsByParams(firstname, lastname);
        const authors = [];

        result.forEach(element => {
            authors.push(
                new Author(
                    element.author_id,
                    element.firstname,
                    element.lastname,
                    element.created_at,
                    element.updated_at
                )
            );
        });

        return authors;
    },

    updateAuthor: async author => {
        // update the author
        let result = await editAuthor(author);

        if (result.affectedRows === 0) { // no affected rows
            return null;
        }
        else {
            // load the updated author
            result = await getAuthorById(author.id);
            const updated = result[0];

            return new Author(
                updated.author_id,
                updated.firstname,
                updated.lastname,
                updated.created_at,
                updated.updated_at
            );
        }
    },

    deleteAuthor: async id => {
        // delete the requested author
        const result = await removeAuthor(id);

        return result.affectedRows;
    }
};