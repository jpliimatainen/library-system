const authorHelpers = require('../helpers/author.helpers');
const bookingHelpers = require('../helpers/booking.helpers');
const genreHelpers = require('../helpers/genre.helpers');

module.exports = {
    checkBookingIdMismatch: (req, res, next) => {
        // get the booking ids
        const id = req.params.bookingId;
        const { bookingId } = req.body;

        if (parseInt(id) !== bookingId) {
            // ids not match
            return res.status(400).json({ success: false, message: 'Booking ids not match.' });
        }

        next();
    },

    checkEmptyFields: (req, res, next) => {
        // get input fields
        const { name, isbn } = req.body;

        const emptyFields = [];

        if (name === null || name === undefined || name === '') {
            emptyFields.push('name');
        }
        if (isbn === null || isbn === undefined || isbn === '') {
            emptyFields.push('isbn');
        }

        if (emptyFields.length > 0) {
            // empty field(s) exist(s)
            return res.status(400).json({ success: false, fields: emptyFields, message: 'Fields cannot be empty' });
        }

        next();
    },

    checkDuplicateBooking: async (req, res, next) => {
        const { isbn } = req.body;

        // get the booking id (if set)
        const id = req.params.bookingId || null;

        try {
            // load the requested booking
            const bookings = await bookingHelpers.getBookings(null, null, isbn, null, null);
            
            if (bookings.length > 0) {
                if (id === null) { // inserting a new booking
                    return res.status(400).json({ success: false, message: 'A booking exists with the given isbn!' });
                }
                else { // updating an booking
                    if (bookings[0].id !== parseInt(id)) {
                        // another booking having the same isbn
                        return res.status(400).json({ success: false, message: 'A booking exists with the given isbn!' });
                    }
                }
            }

            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Fetching the bookings failed!' });
        }
    },

    checkIntegrityErrors: async (req, res, next) => {
        const { authorId, genreId } = req.body;

        try {
            // load the author of the booking
            const author = await authorHelpers.getAuthor(authorId);
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'An invalid author id given!' });
        }

        try {
            // load the genre of the booking
            const author = await genreHelpers.getGenre(genreId);

            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'An invalid genre id given!' });
        }
    }
};