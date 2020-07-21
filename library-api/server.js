const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { port } = require('./app/config/env.config');

const authorRoutes = require('./app/routes/author.routes');
const bookRoutes = require('./app/routes/book.routes');
const bookingRoutes = require('./app/routes/booking.routes');
const customerRoutes = require('./app/routes/customer.routes');
const genreRoutes = require('./app/routes/genre.routes');
const userRoutes = require('./app/routes/user.routes');

const helpers = require('./app/helpers/common.helpers');

const app = express();

const corsOptions = {
    origin: 'http://localhost:5001',
    methods: 'GET, PUT, POST, DELETE'
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(authorRoutes);
app.use(bookRoutes);
app.use(bookingRoutes);
app.use(customerRoutes);
app.use(genreRoutes);
app.use(userRoutes);

app.listen(port, () => {
    console.log(`Server is running on the port ${port}.`);
});

// uncomment this to save post codes to the database
// helpers.savePostCodes();
