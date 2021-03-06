const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/customer.controller');
const authMiddlewares = require('../middlewares/auth.middlewares');
const customerMiddlewares = require('../middlewares/customer.middlewares');
const userMiddlewares = require('../middlewares/user.middlewares');

router.route('/api/customers')
    .get(
        [
            authMiddlewares.validateToken,
            authMiddlewares.isAdmin
        ],
        ctrl.getCustomers
    )
    .post(
        [
            customerMiddlewares.checkEmptyFields,
            userMiddlewares.checkInvalidEmail,
            userMiddlewares.checkInvalidPassword,
            userMiddlewares.checkDuplicateUser,
            customerMiddlewares.checkPostCodeIntegrityError
        ],
        ctrl.createCustomer
    );

router.route('/api/customers/:customerId')
    .get(
        [
            authMiddlewares.validateToken,
            customerMiddlewares.isAuthorized
        ],
        ctrl.getCustomer
    )
    .put(
        [
            authMiddlewares.validateToken,
            customerMiddlewares.isAuthorized,
            customerMiddlewares.checkCustomerIdMismatch,
            customerMiddlewares.checkEmptyFields,
            userMiddlewares.checkInvalidEmail,
            userMiddlewares.checkInvalidPassword,
            customerMiddlewares.checkDuplicateCustomer,
            customerMiddlewares.checkPostCodeIntegrityError
        ],
        ctrl.updateCustomer
    )
    .delete(
        [
            authMiddlewares.validateToken,
            authMiddlewares.isAdmin
            //customerMiddlewares.checkIntegrityError
        ],
        ctrl.deleteCustomer
    );
    
module.exports = router;