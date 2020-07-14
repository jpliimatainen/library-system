const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/author.controller');
const authorMiddlewares = require('../middlewares/author.middlewares');

router.route('/api/authors')
    .get(ctrl.getAuthors)
    .post(ctrl.createAuthor);

router.route('/api/authors/:authorId')
    .get(ctrl.getAuthor)
    .put(
        [
            authorMiddlewares.checkAuthorIdMismatch
        ],
        ctrl.updateAuthor
    )
    .delete(ctrl.deleteAuthor);

module.exports = router;