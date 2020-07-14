const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/customer.controller');
const customerMiddlewares = require('../middlewares/customer.middlewares');

router.route('/api/customers')
    .get(ctrl.getCustomers)
    .post(
        [
            customerMiddlewares.checkPasswordMismatch, 
            customerMiddlewares.checkDuplicateEmail
        ],
        ctrl.createCustomer
    );

router.route('/api/customers/:customerId')
    .get(ctrl.getCustomer)
    .put(
        [
            customerMiddlewares.checkCustomerIdMismatch,
            customerMiddlewares.checkPasswordMismatch, 
            customerMiddlewares.checkDuplicateEmail
        ],
        ctrl.updateCustomer
    )
    .delete(ctrl.deleteCustomer);

module.exports = router;