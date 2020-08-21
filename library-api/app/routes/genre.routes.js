const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/genre.controller');
const authMiddlewares = require('../middlewares/auth.middlewares');
const genreMiddlewares = require('../middlewares/genre.middlewares');

router.route('/api/genres')
    .get(ctrl.getGenres)
    .post(
        [
            authMiddlewares.validateToken,
            authMiddlewares.isAdmin,
            genreMiddlewares.checkEmptyFields,
            genreMiddlewares.checkDuplicateGenre
        ],
        ctrl.createGenre
    );

router.route('/api/genres/:genreId')
    .get(ctrl.getGenre)
    .put(
        [
            authMiddlewares.validateToken,
            authMiddlewares.isAdmin,
            genreMiddlewares.checkGenreIdMismatch,
            genreMiddlewares.checkEmptyFields,
            genreMiddlewares.checkDuplicateGenre
        ],
        ctrl.updateGenre
    )
    .delete(
        [
            authMiddlewares.validateToken,
            authMiddlewares.isAdmin,
            genreMiddlewares.checkIntegrityError
        ],
        ctrl.deleteGenre
    );

module.exports = router;