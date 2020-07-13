const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    port: process.env.PORT,
    secret: process.env.SECRET
};