const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/book.controller');
const authMiddlewares = require('../middlewares/auth.middlewares');
const bookMiddlewares = require('../middlewares/book.middlewares');

router.route('/api/books')
    .get(ctrl.getBooks)
    .post(
        [
            authMiddlewares.validateToken,
            authMiddlewares.isAdmin,
            bookMiddlewares.checkEmptyFields,
            bookMiddlewares.checkIntegrityErrors,
            bookMiddlewares.checkDuplicateBook
        ],
        ctrl.createBook
    );

router.route('/api/books/:bookId')
    .get(ctrl.getBook)
    .put(
        [
            authMiddlewares.validateToken,
            authMiddlewares.isAdmin,
            bookMiddlewares.checkBookIdMismatch,
            bookMiddlewares.checkEmptyFields,
            bookMiddlewares.checkIntegrityErrors,
            bookMiddlewares.checkDuplicateBook
        ],
        ctrl.updateBook
    )
    .delete(
        [
            authMiddlewares.validateToken,
            authMiddlewares.isAdmin
        ],
        ctrl.deleteBook
    );

module.exports = router;