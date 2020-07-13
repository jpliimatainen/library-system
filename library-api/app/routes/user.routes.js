const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/user.controller');
const middlewares = require('../middlewares/user.middlewares');

router.route('/api/users')
    .get(ctrl.getUsers)
    .post(
        [
            middlewares.checkPasswordMismatch, 
            middlewares.checkDuplicateEmail
        ],
        ctrl.createUser
    );

router.route('/api/users/:userId')
    .get(ctrl.getUser)
    .put(
        [
            middlewares.checkUserIdMismatch,
            middlewares.checkPasswordMismatch, 
            middlewares.checkDuplicateEmail
        ],
        ctrl.updateUser
    )
    .delete(ctrl.deleteUser);

module.exports = router;