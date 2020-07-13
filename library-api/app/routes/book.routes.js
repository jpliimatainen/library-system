const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/book.controller');

router.route('/api/books')
    .get(ctrl.getBooks)
    .post(ctrl.createBook);

router.route('/api/books/:bookId')
    .get(ctrl.getBook)
    .put(ctrl.updateBook)
    .delete(ctrl.deleteBook);

module.exports = router;