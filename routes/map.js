const express = require('express');
const router = express.Router();
const { Tag, Map } = require('../models/index');
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
      map.dataValues.createdAt = dayjs(map.dataValues.createdAt).locale('fr').format('DD MMMM YYYY');
    });

    res.render('editor/maps', { maps: data, admin: !!req.session.userId });
  });
});

router.get('/cartes/:id', (req, res) => {
  Map.findByPk(
    req.params.id, 
    {
    include: [{
      model: Tag,
      attributes: ['id', 'name'],
    }]
  }).then(async (data) => {
    if (data) {
      data.dataValues.createdAt = dayjs(data.dataValues.createdAt).locale('fr').format('DD MMMM YYYY à HH:mm:ss');

      let tags = [];
      if (req.session.userId) {
        tags = await Tag.findAll();
      }

      res.render('editor/map', { map: data, tags: tags, admin: !!req.session.userId });

    } else {
      res.sendStatus(404);
    }
  }).catch(err => res.sendStatus(500));
});

router.post('/cartes/:id/tag', isAdmin, async (req, res) => {
  const map = await Map.findByPk(req.params.id);
  const tag = await Tag.findByPk(req.body.tagId);

  map.addTag(tag).then(resp => res.sendStatus(200));
});

router.delete('/cartes/:mapId/tag/:tagId', isAdmin, async (req, res) => {
  const map = await Map.findByPk(req.params.mapId);
  const tag = await Tag.findByPk(req.params.tagId);

  map.removeTag(tag).then(resp => res.sendStatus(200));
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

module.exports = router;
