const dbQuery = require('../models/db.model');
const authorHelpers = require('../helpers/author.helpers');
const commonHelpers = require('../helpers/common.helpers');
const customerHelpers = require('../helpers/customer.helpers');
const genreHelpers = require('../helpers/genre.helpers');

const Booking = require('../models/Booking');
const BookBooking = require('../models/BookBooking');
const BookState = require('../models/BookState');

const insertBooking = booking => {
    const { bookingDate, dueDate, customerId } = booking;

    const query = "INSERT INTO  bookings(booking_date, due_date, customer_id) VALUES(?, ?, ?)";

    // execute an insert query
    return dbQuery(query, [bookingDate, dueDate, customerId]);
};

const insertBookBooking = (bookId, bookingId, bookStateId) => {
    const query = "INSERT INTO  books_bookings(book_id, booking_id, book_state_id) VALUES(?, ?, ?)";

    // execute an insert query
    return dbQuery(query, [bookId, bookingId, bookStateId]);
};

const getBookingById = id => {
    const query = "SELECT booking_id AS 'bookingId', booking_date AS 'bookingDate', due_date AS 'dueDate', created_at "
        + "AS 'createdAt', updated_at AS 'updatedAt', customer_id AS 'customerId' FROM bookings WHERE booking_id = ?";

    // execute a select query
    return dbQuery(query, [id]);
};

const getBookingsByParams = (bookingDateStart, bookingDateEnd, dueDateStart, dueDateEnd, customerId, bookId, bookStateId) => {
    const params = [];

    let query = "SELECT DISTINCT b.booking_id AS 'bookingId', b.booking_date AS 'bookingDate', b.due_date AS 'dueDate', "
        + "b.created_at AS 'createdAt', b.updated_at AS 'updatedAt', b.customer_id AS 'customerId' FROM bookings b "
        + "JOIN books_bookings bb ON b.booking_id = bb.booking_id WHERE 1 = 1";

    if (bookingDateStart !== null && bookingDateStart !== undefined) {
        query += " AND b.booking_date >= ?";
        params.push(bookingDateStart);
    }
    if (bookingDateEnd !== null && bookingDateEnd !== undefined) {
        query += " AND b.booking_date <= ?";
        params.push(bookingDateEnd);
    }
    if (dueDateStart !== null && dueDateStart !== undefined) {
        query += " AND b.due_date >= ?";
        params.push(dueDateStart);
    }
    if (dueDateEnd !== null && dueDateEnd !== undefined) {
        query += " AND b.due_date <= ?";
        params.push(dueDateEnd);
    }
    if (customerId !== null && customerId !== undefined) {
        query += " AND b.customer_id = ?";
        params.push(customerId);
    }
    if (bookId !== null && bookId !== undefined) {
        query += " AND bb.book_id = ?";
        params.push(bookId);
    }
    if (bookStateId !== null && bookStateId !== undefined) {
        query += " AND bb.book_state_id = ?";
        params.push(bookStateId);
    }

    // execute a select query
    return dbQuery(query, params);
};

const getBookBookingsByBookingId = bookingId => {
    const query = "SELECT bb.created_at AS 'createdAt', bb.updated_at AS 'updatedAt', bb.book_id AS 'bookId', "
        + "bb.booking_id AS 'bookingId', bb.book_state_id AS 'bookStateId', bs.name AS 'bookStateName' "
        + "FROM books_bookings bb JOIN book_states bs ON bb.book_state_id = bs.book_state_id WHERE bb.booking_id = ?";

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
            await insertBookBooking(element.bookId, created.bookingId, element.bookStateId);
        });

        // load the created records
        result = await getBookBookingsByBookingId(created.bookingId);

        const bookBookings = [];

        result.forEach(element => {
            bookBookings.push(new BookBooking(
                element.createdAt,
                element.updatedAt,
                element.bookId,
                element.bookingId,
                element.bookStateId,
                new BookState(
                    element.bookStateId,
                    element.bookStateName
                )
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
        let result = await getBookingById(id);
        const loaded = result[0];

        // load the customer object
        const customer = await customerHelpers.getCustomer(loaded.customerId);

        // load the books_bookings records
        result = await getBookBookingsByBookingId(loaded.bookingId);

        const bookBookings = [];

        result.forEach(element => {
            bookBookings.push(new BookBooking(
                element.createdAt,
                element.updatedAt,
                element.bookId,
                element.bookingId,
                element.bookStateId,
                new BookState(
                    element.bookStateId,
                    element.bookStateName
                )
            ));
        });

        return new Booking(
            loaded.bookingId,
            loaded.bookingDate,
            loaded.dueDate,
            loaded.createdAt,
            loaded.updatedAt,
            loaded.customerId,
            customer,
            bookBookings
        );
    },

    getBookings: async (bookingDateStart, bookingDateEnd, dueDateStart, dueDateEnd, customerId, bookId, bookStateId) => {
        // load the requested bookings
        let result = await getBookingsByParams(
            bookingDateStart, bookingDateEnd, dueDateStart, dueDateEnd, customerId, bookId, bookStateId);

        const bookings = [];
        let customer = {};
        let bookBookings = [];
        
        await commonHelpers.asyncForEach(result, async booking => {
            bookBookings = [];

            // load the customer object
            customer = await customerHelpers.getCustomer(booking.customerId);

            // load the books_bookings records
            result = await getBookBookingsByBookingId(booking.bookingId);

            result.forEach(bookBooking => {
                bookBookings.push(new BookBooking(
                    bookBooking.createdAt,
                    bookBooking.updatedAt,
                    bookBooking.bookId,
                    bookBooking.bookingId,
                    bookBooking.bookStateId,
                    new BookState(
                        bookBooking.bookStateId,
                        bookBooking.bookStateName
                    )
                ));
            });

            bookings.push(
                new Booking(
                    booking.bookingId,
                    booking.bookingDate,
                    booking.dueDate,
                    booking.createdAt,
                    booking.updatedAt,
                    booking.customerId,
                    customer,
                    bookBookings
                )
            );
        });

        return bookings;
    },

    //bookingsExist: async 

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