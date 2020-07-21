const dbQuery = require('../models/db.model');
const authorHelpers = require('../helpers/author.helpers');
const commonHelpers = require('../helpers/common.helpers');
const customerHelpers = require('../helpers/customer.helpers');
const genreHelpers = require('../helpers/genre.helpers');

const Booking = require('../models/Booking');
const BookBooking = require('../models/BookBooking');

const insertBooking = booking => {
    const { bookingDate, dueDate, customerId } = booking;

    const query = "INSERT INTO  bookings(booking_date, due_date, customer_id) VALUES(?, ?, ?)";

    // execute an insert query
    return dbQuery(query, [bookingDate, dueDate, customerId]);
};

const insertBookBooking = (bookId, bookingId) => {
    const query = "INSERT INTO  books_bookings(book_id, booking_id) VALUES(?, ?)";

    // execute an insert query
    return dbQuery(query, [bookId, bookingId]);
};

const getBookingById = id => {
    const query = "SELECT booking_id AS 'bookingId', booking_date AS 'bookingDate', due_date AS 'dueDate', created_at "
        + "AS 'createdAt', updated_at AS 'updatedAt', customer_id AS 'customerId' FROM bookings WHERE booking_id = ?";

    // execute a select query
    return dbQuery(query, [id]);
};

const getBookingsByParams = (name, description, isbn, authorId, genreId) => {
    const params = [];

    let query = "SELECT booking_id AS 'bookingId', name, description, isbn, pages, created_at AS 'createdAt', "
        + "updated_at AS 'updatedAt', author_id AS 'authorId', genre_id AS 'genreId' FROM bookings WHERE 1 = 1";

    if (name !== null && name !== undefined) {
        query += " AND UPPER(name) LIKE ?";
        params.push('%' + name.toUpperCase() + '%');
    }
    if (description !== null && description !== undefined) {
        query += " AND UPPER(description) LIKE ?";
        params.push('%' + description.toUpperCase() + '%');
    }
    if (isbn !== null && isbn !== undefined) {
        query += " AND UPPER(isbn) = ?";
        params.push(isbn.toUpperCase());
    }
    if (authorId !== null && authorId !== undefined) {
        query += " AND author_id = ?";
        params.push(authorId);
    }
    if (genreId !== null && genreId !== undefined) {
        query += " AND genre_id = ?";
        params.push(genreId);
    }

    // execute a select query
    return dbQuery(query, params);
};

const getBookBookingsByBookingId = bookingId => {
    const query = "SELECT created_at AS 'createdAt', updated_at AS 'updatedAt', book_id AS 'bookId', "
        + "booking_id AS 'bookingId' FROM books_bookings WHERE booking_id = ?";

    // execute a select query
    return dbQuery(query, [bookingId]);
};

const editBooking = booking => {
    const { name, description, isbn, pages, authorId, genreId, id } = booking;

    const query = "UPDATE bookings SET name = ?, description = ?, isbn = ?, pages = ?, "
        + "updated_at = CURRENT_TIMESTAMP(), author_id = ?, genre_id = ? WHERE booking_id = ?";

    // execute an update query
    return dbQuery(query, [name, description, isbn, pages, authorId, genreId, id]);
};

const removeBooking = id => {
    const query = "DELETE FROM bookings WHERE booking_id = ?";

    // execute a delete query
    return dbQuery(query, [id]);
};

module.exports = {

    createBooking: async booking => {
        // create a new booking
        let result = await insertBooking(booking);

        // load the created booking
        result = await getBookingById(result.insertId);
        const created = result[0];

        // load the customer object
        const customer = await customerHelpers.getCustomer(created.customerId);

        // create books_bookings records
        await commonHelpers.asyncForEach(booking.bookBookings, async element => {
            await insertBookBooking(element.bookId, created.bookingId);
        });

        // load the created records
        result = await getBookBookingsByBookingId(created.bookingId);

        const bookBookings = [];

        result.forEach(element => {
            bookBookings.push(new BookBooking(
                element.createdAt,
                element.updatedAt,
                element.bookId,
                element.bookingId
            ));
        });

        return new Booking(
            created.bookingId,
            created.bookingDate,
            created.dueDate,
            created.createdAt,
            created.updatedAt,
            created.customerId,
            customer,
            bookBookings
        );
    },

    getBooking: async id => {
        // load the requested booking
        const result = await getBookingById(id);
        const loaded = result[0];

        // get the author of the booking
        const author = await authorHelpers.getAuthor(loaded.authorId);

        // get the genre of the booking
        const genre = await genreHelpers.getGenre(loaded.genreId);

        return new Booking(
            loaded.bookingId,
            loaded.name,
            loaded.description,
            loaded.isbn,
            loaded.pages,
            loaded.createdAt,
            loaded.updatedAt,
            author.authorId,
            author,
            genre.genreId,
            genre
        );
    },

    getBookings: async (name, description, isbn, authorId, genreId) => {
        // load the requested bookings
        const result = await getBookingsByParams(name, description, isbn, authorId, genreId);
        
        const bookings = [];
        let author, genre = {};
        
        await commonHelpers.asyncForEach(result, async element => {
            // get the author of the booking
            author = await authorHelpers.getAuthor(element.authorId);

            // get the genre of the booking
            genre = await genreHelpers.getGenre(element.genreId);

            bookings.push(
                new Booking(
                    element.bookingId,
                    element.name,
                    element.description,
                    element.isbn,
                    element.pages,
                    element.createdAt,
                    element.updatedAt,
                    element.authorId,
                    author,
                    element.genreId,
                    genre
                )
            );
        });
        
        return bookings;
    },

    updateBooking: async booking => {
        // update the booking
        let result = await editBooking(booking);

        if (result.affectedRows === 0) { // no affected rows
            return null;
        }
        else {
            // load the updated booking
            result = await getBookingById(booking.id);
            const updated = result[0];

            // get the author of the booking
            const author = await authorHelpers.getAuthor(updated.authorId);

            // get the genre of the booking
            const genre = await genreHelpers.getGenre(updated.genreId);

            return new Booking(
                updated.bookingId,
                updated.name,
                updated.description,
                updated.isbn,
                updated.pages,
                updated.createdAt,
                updated.updatedAt,
                author.authorId,
                author,
                genre.genreId,
                genre
            );
        }
    },

    deleteBooking: async id => {
        // delete the requested booking
        const result = await removeBooking(id);

        return result.affectedRows;
    }
};