const express = require('express');
const router = express.Router();
const Map = require('../models/Map');
const dayjs = require('dayjs');

router.get('/cartes', (req, res) => {
  Map.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  }).then((data) => {
    data.forEach(map => {
      map.dataValues.createdAt = dayjs(map.dataValues.createdAt).locale('fr').format('DD MMMM YYYY');
    });

    res.render('editor/maps', { maps: data });
  });
});

router.get('/cartes/:id', (req, res) => {
  Map.findByPk(req.params.id).then((data) => {
    if (data) {
      data.dataValues.createdAt = dayjs(data.dataValues.createdAt).locale('fr').format('DD MMMM YYYY à HH:mm:ss');
      res.render('editor/map', { map: data });
    } else {
      res.sendStatus(404);
    }
  }).catch(err => res.sendStatus(500));
});

/*
router.delete('/carte/:id', (req, res) => {
  Map.findByPk(req.params.id).then((data) => data ? res.json(data) : res.sendStatus(404))
    .catch(err => res.sendStatus(500));
});
*/

module.exports = router;
