const dbQuery = require('../models/db.model');
const Genre = require('../models/Genre');

const insertGenre = genre => {
    const query = "INSERT INTO  genres(classification, name) VALUES(?, ?)";

    // execute an insert query
    return dbQuery(query, [genre.classification, genre.name]);
};

const getGenreById = id => {
    const query = "SELECT genre_id, classification, name, created_at, updated_at FROM "
        + "genres WHERE genre_id = ?";

    // execute a select query
    return dbQuery(query, [id]);
};

const getGenresByParams = (classification, name) => {
    const params = [];

    let query = "SELECT genre_id, classification, name, created_at, updated_at "
        + "FROM genres WHERE 1 = 1";

    if (classification !== null && classification !== undefined) {
        query += " AND UPPER(classification) LIKE ?";
        params.push('%' + classification.toUpperCase() + '%');
    }
    if (name !== null && name !== undefined) {
        query += " AND UPPER(name) LIKE ?";
        params.push('%' + name.toUpperCase() + '%');
    }

    // execute a select query
    return dbQuery(query, params);
};

const editGenre = genre => {
    const query = "UPDATE genres SET classification = ?, name = ?, "
        + "updated_at = CURRENT_TIMESTAMP() WHERE genre_id = ?";

    // execute an update query
    return dbQuery(query, [genre.classification, genre.name, genre.id]);
};

const removeGenre = id => {
    const query = "DELETE FROM genres WHERE genre_id = ?";

    // execute a delete query
    return dbQuery(query, [id]);
};

module.exports = {

    createGenre: async genre => {
        // create a new genre
        let result = await insertGenre(genre);

        // load the created genre
        result = await getGenreById(result.insertId);
        const created = result[0];

        return new Genre(
            created.genre_id,
            created.classification,
            created.name,
            created.created_at,
            created.updated_at
        );
    },

    getGenre: async id => {
        // load the requested genre
        const result = await getGenreById(id);
        const loaded = result[0];

        return new Genre(
            loaded.genre_id,
            loaded.classification,
            loaded.name,
            loaded.created_at,
            loaded.updated_at
        );
    },

    getGenres: async (classification, name) => {
        // load the requested genres
        const result = await getGenresByParams(classification, name);
        const genres = [];

        result.forEach(element => {
            genres.push(
                new Genre(
                    element.genre_id,
                    element.classification,
                    element.name,
                    element.created_at,
                    element.updated_at
                )
            );
        });

        return genres;
    },

    updateGenre: async genre => {
        // update the genre
        let result = await editGenre(genre);

        if (result.affectedRows === 0) { // no affected rows
            return null;
        }
        else {
            // load the updated genre
            result = await getGenreById(genre.id);
            const updated = result[0];

            return new Genre(
                updated.genre_id,
                updated.classification,
                updated.name,
                updated.created_at,
                updated.updated_at
            );
        }
    },

    deleteGenre: async id => {
        // delete the requested genre
        const result = await removeGenre(id);

        return result.affectedRows;
    }
};