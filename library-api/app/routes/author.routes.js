const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/author.controller');
const authorMiddlewares = require('../middlewares/author.middlewares');

router.route('/api/authors')
    .get(ctrl.getAuthors)
    .post(
        [
            authorMiddlewares.checkEmptyFields,
            authorMiddlewares.checkDuplicateAuthor
        ],
        ctrl.createAuthor
    );

router.route('/api/authors/:authorId')
    .get(ctrl.getAuthor)
    .put(
        [
            authorMiddlewares.checkAuthorIdMismatch,
            authorMiddlewares.checkEmptyFields,
            authorMiddlewares.checkDuplicateAuthor
        ],
        ctrl.updateAuthor
    )
    .delete(
        [
            authorMiddlewares.checkIntegrityError
        ],
        ctrl.deleteAuthor);

module.exports = router;