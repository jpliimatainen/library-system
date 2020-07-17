const dbQuery = require('../models/db.model');
const postCodes = require('datasets-fi-postalcodes');

const insertPostCode = (postCode, town) => {
    const query = "INSERT INTO  posts(post_code, town) VALUES(?, ?)";

    // execute an insert query
    return dbQuery(query, [postCode, town]);
}

module.exports = {
    /*  A helper function for asynchronous looping of arrays.
        https://gist.github.com/Atinux/fd2bcce63e44a7d3addddc166ce93fb2
    */
    asyncForEach: async (array, callback) => {
        for (let i = 0; i < array.length; i++) {
            await callback(array[i], i, array);
        }
    },

    // save Finnish post codes to the database
    savePostCodes: async () => {
        let result = '';

        for (const [key, value] of Object.entries(postCodes)) {
            result = await insertPostCode(key, value);
        }
    }
};