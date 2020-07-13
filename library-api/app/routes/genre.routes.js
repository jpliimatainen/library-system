const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/genre.controller');

router.route('/api/genres')
    .get(ctrl.getGenres)
    .post(ctrl.createGenre);

router.route('/api/genres/:genreId')
    .get(ctrl.getGenre)
    .put(ctrl.updateGenre)
    .delete(ctrl.deleteGenre);

module.exports = router;