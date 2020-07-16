const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/genre.controller');
const genreMiddlewares = require('../middlewares/genre.middlewares');

router.route('/api/genres')
    .get(ctrl.getGenres)
    .post(
        [
            genreMiddlewares.checkEmptyFields,
            genreMiddlewares.checkDuplicateGenre
        ],
        ctrl.createGenre
    );

router.route('/api/genres/:genreId')
    .get(ctrl.getGenre)
    .put(
        [
            genreMiddlewares.checkGenreIdMismatch,
            genreMiddlewares.checkEmptyFields,
            genreMiddlewares.checkDuplicateGenre
        ],
        ctrl.updateGenre
    )
    .delete(
        [
            genreMiddlewares.checkIntegrityError
        ],
        ctrl.deleteGenre
    );

module.exports = router;