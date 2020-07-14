const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/user.controller');
const commonMiddlewares = require('../middlewares/common.middlewares');
const userMiddlewares = require('../middlewares/user.middlewares');

router.route('/api/users')
    .get(ctrl.getUsers)
    .post(
        [
            userMiddlewares.checkPasswordMismatch, 
            userMiddlewares.checkDuplicateEmail
        ],
        ctrl.createUser
    );

router.route('/api/users/:userId')
    .get(ctrl.getUser)
    .put(
        [
            commonMiddlewares.checkUserIdMismatch,
            userMiddlewares.checkPasswordMismatch, 
            userMiddlewares.checkDuplicateEmail
        ],
        ctrl.updateUser
    )
    .delete(ctrl.deleteUser);

module.exports = router;