const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/booking.controller');
const authMiddlewares = require('../middlewares/auth.middlewares');
const bookingMiddlewares = require('../middlewares/booking.middlewares');

router.route('/api/bookings')
    .get(ctrl.getBookings);

router.route('/api/customers/:customerId/bookings')
    .get(ctrl.getBookings)
    .post(
        [
            //authMiddlewares.validateToken,
            //bookingMiddlewares.checkEmptyFields,
            //bookingMiddlewares.checkIntegrityErrors,
            //bookingMiddlewares.checkDuplicateBooking
        ],
        ctrl.createBooking
    );

router.route('/api/customers/:customerId/bookings/:bookingId')
    .get(ctrl.getBooking)
    .put(
        [
            //authMiddlewares.validateToken,
            bookingMiddlewares.checkBookingIdMismatch,
            bookingMiddlewares.checkEmptyFields,
            bookingMiddlewares.checkIntegrityErrors,
            bookingMiddlewares.checkDuplicateBooking
        ],
        ctrl.updateBooking
    )
    .delete(
        //[authMiddlewares.validateToken],
        ctrl.deleteBooking
    );

module.exports = router;