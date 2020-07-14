const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/genre.controller');
const commonMiddlewares = require('../middlewares/common.middlewares');

router.route('/api/genres')
    .get(ctrl.getGenres)
    .post(ctrl.createGenre);

router.route('/api/genres/:genreId')
    .get(ctrl.getGenre)
    .put(
        [
            commonMiddlewares.checkUserIdMismatch
        ],
        ctrl.updateGenre
    )
    .delete(ctrl.deleteGenre);

module.exports = router;