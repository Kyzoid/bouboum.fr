const express = require('express');
const router = express.Router();
const Map = require('../models/Map');
const Tag = require('../models/Tag');
const dayjs = require('dayjs');

const isAdmin = (req, res, next) => {
  if (!req.session.userId) {
    res.sendStatus(401);
  } else {
    next();
  }
};

router.get('/cartes', (req, res) => {
  Map.findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: Tag,
      attributes: ['name'],

    }]
  }).then((data) => {
    data.forEach(map => {
      console.log(map.tags);
      map.dataValues.createdAt = dayjs(map.dataValues.createdAt).locale('fr').format('DD MMMM YYYY');
    });

    res.render('editor/maps', { maps: data, admin: !!req.session.userId });
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

router.delete('/cartes/:id', isAdmin, (req, res) => {
  Map.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((response) => {
      if (response) {
        res.sendStatus(204)
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => console.log(err));
});

router.get('/cartes/:id/tag', isAdmin, (req, res) => {
  res.status(200).send(req.body.game);
});

/*
router.delete('/carte/:id', (req, res) => {
  Map.findByPk(req.params.id).then((data) => data ? res.json(data) : res.sendStatus(404))
    .catch(err => res.sendStatus(500));
});
*/

module.exports = router;
