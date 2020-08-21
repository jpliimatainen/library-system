const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/author.controller');
const authMiddlewares = require('../middlewares/auth.middlewares');
const authorMiddlewares = require('../middlewares/author.middlewares');

router.route('/api/authors')
    .get(ctrl.getAuthors)
    .post(
        [
            authMiddlewares.validateToken,
            authMiddlewares.isAdmin,
            authorMiddlewares.checkEmptyFields,
            authorMiddlewares.checkDuplicateAuthor
        ],
        ctrl.createAuthor
    );

router.route('/api/authors/:authorId')
    .get(ctrl.getAuthor)
    .put(
        [
            authMiddlewares.validateToken,
            authMiddlewares.isAdmin,
            authorMiddlewares.checkAuthorIdMismatch,
            authorMiddlewares.checkEmptyFields,
            authorMiddlewares.checkDuplicateAuthor
        ],
        ctrl.updateAuthor
    )
    .delete(
        [
            authMiddlewares.validateToken,
            authMiddlewares.isAdmin,
            authorMiddlewares.checkIntegrityError
        ],
        ctrl.deleteAuthor
    );

module.exports = router;