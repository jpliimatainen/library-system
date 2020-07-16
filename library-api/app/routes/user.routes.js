const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/user.controller');
const authMiddlewares = require('../middlewares/auth.middlewares');
const userMiddlewares = require('../middlewares/user.middlewares');

router.route('/api/users')
    .get(
        [authMiddlewares.validateToken],
        ctrl.getUsers
    )
    .post(
        [
            userMiddlewares.checkEmptyFields,
            userMiddlewares.checkInvalidEmail,
            userMiddlewares.checkInvalidPassword,
            userMiddlewares.checkDuplicateUser,
            userMiddlewares.checkRoleIntegrityError
        ],
        ctrl.createUser
    );

router.route('/api/users/:userId')
    .get(ctrl.getUser)
    .put(
        [
            userMiddlewares.checkUserIdMismatch,
            userMiddlewares.checkEmptyFields,
            userMiddlewares.checkInvalidEmail,
            userMiddlewares.checkInvalidPassword,
            userMiddlewares.checkDuplicateUser,
            userMiddlewares.checkRoleIntegrityError
        ],
        ctrl.updateUser
    )
    .delete(
        [
            //userMiddlewares.checkIntegrityError
        ],
        ctrl.deleteUser
    );

router.route('/api/users/login')
    .post(
        [userMiddlewares.checkEmptyCredentials],
        ctrl.login
    );

module.exports = router;