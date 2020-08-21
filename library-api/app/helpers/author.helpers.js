const dbQuery = require('../models/db.model');
const Author = require('../models/Author');

const insertAuthor = author => {
    const { firstname, lastname } = author;

    const query = "INSERT INTO  authors(firstname, lastname) VALUES(?, ?)";

    // execute an insert query
    return dbQuery(query, [firstname, lastname]);
};

const getAuthorsByParams = (id, firstname, lastname) => {
    const params = [];

    let query = "SELECT author_id AS 'authorId', firstname, lastname, created_at "
        + "AS 'createdAt', updated_at AS 'updatedAt' FROM authors WHERE 1 = 1";

    if (id !== null && id !== undefined) {
        query += " AND author_id = ?";
        params.push(id);
    }
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
    const { firstname, lastname, id } = author;

    const query = "UPDATE authors SET firstname = ?, lastname = ?, "
        + "updated_at = CURRENT_TIMESTAMP() WHERE author_id = ?";

    // execute an update query
    return dbQuery(query, [firstname, lastname, id]);
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
        result = await getAuthorsByParams(result.insertId, null, null);
        const created = result[0];

        return new Author(
            created.authorId,
            created.firstname,
            created.lastname,
            created.createdAt,
            created.updatedAt
        );
    },

    getAuthorById: async id => {
        // load the requested author
        const result = await getAuthorsByParams(id, null, null);
        const loaded = result[0];

        return new Author(
            loaded.authorId,
            loaded.firstname,
            loaded.lastname,
            loaded.createdAt,
            loaded.updatedAt
        );
    },

    getAuthors: async (firstname, lastname) => {
        // load the requested authors
        const result = await getAuthorsByParams(null, firstname, lastname);
        const authors = [];

        result.forEach(element => {
            authors.push(
                new Author(
                    element.authorId,
                    element.firstname,
                    element.lastname,
                    element.createdAt,
                    element.updatedAt
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
            result = await getAuthorsByParams(author.id, null, null);
            const updated = result[0];

            return new Author(
                updated.authorId,
                updated.firstname,
                updated.lastname,
                updated.createdAt,
                updated.updatedAt
            );
        }
    },

    deleteAuthor: async id => {
        // delete the requested author
        const result = await removeAuthor(id);

        return result.affectedRows;
    }
};