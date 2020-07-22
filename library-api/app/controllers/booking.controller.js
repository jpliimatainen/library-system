const helpers = require('../helpers/booking.helpers');
const Booking = require('../models/Booking');
const BookBooking = require('../models/BookBooking');

module.exports = {

    createBooking: async (req, res) => {
        // get POST data
        const { bookingDate, dueDate, customerId, bookIds } = req.body;

        const inputBooking = new Booking(
            null,
            new Date(bookingDate),
            new Date(dueDate),
            null,
            null,
            customerId,
            null,
            []
        );

        bookIds.forEach(element => {
            inputBooking.bookBookings.push(new BookBooking(
                null,
                null,
                element,
                null,
                1, // book state "on loan"
                null
            ));
        });

        try {
            // create a new booking
            const outputBooking = await helpers.createBooking(inputBooking);

            return res.status(201).json({ success: true, data: outputBooking });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Creating a booking failed!' });
        }
    },

    getBooking: async (req, res) => {
        // get the id
        const { bookingId } = req.params;

        try {
            // load the requested booking
            const booking = await helpers.getBooking(bookingId);

            return res.json({ success: true, data: booking });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the booking failed!' });
        }
    },

    getBookings: async (req, res) => {
        // get query parameters
        const { bookingDateStart, bookingDateEnd, dueDateStart, dueDateEnd, customerId, bookId, bookStateId } = req.query;

        try {
            // load the requested bookings
            const bookings = await helpers.getBookings(
                bookingDateStart, bookingDateEnd, dueDateStart, dueDateEnd, customerId, bookId, bookStateId);

            return res.json({ success: true, data: bookings });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the bookings failed!' });
        }
    },

    getCustomerBookings: async (req, res) => {
        // get query parameters
        const { bookingDateStart, bookingDateEnd, dueDateStart, dueDateEnd, bookId, bookStateId } = req.query;
        // get customer id from url path or query (if set)
        const { customerId } = req.params || req.query;

        try {
            // load the requested bookings
            const bookings = await helpers.getBookings(
                bookingDateStart, bookingDateEnd, dueDateStart, dueDateEnd, customerId, bookId, bookStateId);

            return res.json({ success: true, data: bookings });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the bookings failed!' });
        }
    },

    updateBooking: async (req, res) => {
        // get the booking id
        const id = req.params.bookingId;

        // get PUT data
        const { name, description, isbn, pages, authorId, genreId } = req.body;

        const inputBooking = new Booking(
            id,
            name,
            description,
            isbn,
            pages,
            null,
            null,
            authorId,
            null,
            genreId,
            null
        );

        try {
            // update the booking
            const outputBooking = await helpers.updateBooking(inputBooking);

            if (outputBooking === null) { // no affected rows
                return res.status(400).json({ success: false, message: 'No bookings updated.' });
            }

            return res.json({ success: true, data: outputBooking });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Updating the booking failed!' });
        }
    },

    deleteBooking: async (req, res) => {
        // get the booking id
        const id = req.params.bookingId;

        try {
            // delete the requested booking
            const result = await helpers.deleteBooking(id);

            if (result === 0) { // no affected rows
                return res.status(400).json({ success: false, message: 'No bookings deleted.' });
            }

            return res.json({ success: true, message: `Booking with the id ${id} deleted.` });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Deleting the booking failed!' });
        }
    }
};