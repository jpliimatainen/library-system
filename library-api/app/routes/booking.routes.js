const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/booking.controller');
const bookingMiddlewares = require('../middlewares/booking.middlewares');

router.route('/api/bookings')
    .get(ctrl.getBookings);

router.route('/api/customers/:customerId/bookings')
    .get(ctrl.getCustomerBookings)
    .post(
        [
            //authMiddlewares.validateToken,
            bookingMiddlewares.checkCustomerIdMismatch,
            bookingMiddlewares.checkInvalidDates,
            bookingMiddlewares.checkIntegrityErrors,
        ],
        ctrl.createBooking
    );

router.route('/api/customers/:customerId/bookings/:bookingId')
    .get(
        [bookingMiddlewares.checkCustomerIdMismatchGet],
        ctrl.getBooking)
    .put(
        [
            //authMiddlewares.validateToken,
            bookingMiddlewares.checkCustomerIdMismatch,
            bookingMiddlewares.checkIntegrityErrors,
        ],
        ctrl.updateBooking
    )
    .delete(
        //[authMiddlewares.validateToken],
        ctrl.deleteBooking
    );

module.exports = router;