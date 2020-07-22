const bookHelpers = require('../helpers/book.helpers');
const bookingHelpers = require('../helpers/booking.helpers');
const commonHelpers = require('../helpers/common.helpers');
const customerHelpers = require('../helpers/customer.helpers');

module.exports = {

    checkCustomerIdMismatch: (req, res, next) => {
        // get customer ids
        const id = req.params.customerId;
        const { customerId } = req.body;

        if (parseInt(id) !== customerId) {
            // ids not match
            return res.status(400).json({ success: false, message: 'Customer ids not match.' });
        }

        next();
    },

    checkCustomerIdMismatchGet: async (req, res, next) => {
        const { customerId, bookingId } = req.params;
        const booking = await bookingHelpers.getBooking(bookingId);
        
        if (parseInt(customerId) !== booking.customerId) {
            return res.status(400).json({ success: false, message: 'Customer ids not match.' });
        }

        next();
    },

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

    checkInvalidDates: (req, res, next) => {
        const { bookingDate, dueDate } = req.body;

        try {
            // try to parse date objects
            const bDate = Date.parse(bookingDate);
            const dDate = Date.parse(dueDate);
            
            if (isNaN(bDate) || isNaN(dDate)) {
                return res.status(400).json({ success: false, message: 'An invalid date given!' });
            }
            
            if (dDate <= bDate) {
                return res.status(400).json({ success: false, message: 'Due date must be later than booking date!' });
            }

            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'An invalid date given!' });
        }
    },

    checkIntegrityErrors: async (req, res, next) => {
        const { customerId, bookIds } = req.body;

        try {
            // load the customer of the booking
            const customer = await customerHelpers.getCustomer(customerId);
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'An invalid customer id given!' });
        }

        try {
            // load the books of the booking
            await commonHelpers.asyncForEach(bookIds, async element => {
                await bookHelpers.getBook(element);
            });

            next();
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'An invalid book id given!' });
        }
    }
};