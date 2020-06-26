const express = require('express');
const dayjs = require('dayjs');
const router = express.Router();
const Player = require('../models/Player');
const { ScoreBouboum, ScoreAaaah } = require('../models/index');
require('dayjs/locale/fr');

router.get('/bouboum', (req, res, next) => {
  res.render('rankings/index', {
    date: dayjs().locale('fr').format('DD/MM/YYYY'),
    game: 'Bouboum'
  });
});

router.get('/aaaah', (req, res, next) => {
  res.render('rankings/index', {
    date: dayjs().locale('fr').format('DD/MM/YYYY'),
    game: 'Aaaah !'
  });
});

router.get('/', async (req, res, next) => {
  const date = (req.query.date) ? req.query.date : dayjs().format('YYYY-MM-DD');
  const game = req.query.game;

  if (game === 'bouboum') {
    ScoreBouboum.findAll({
      order: [['win', 'DESC']],
      where: {
        date: date
      },
      attributes: ['player.name', 'win', 'total', 'ratio'],
      include: [{ model: Player, attributes: ['name'] }]
    }).then(scores => {
      res.send(scores);
    });

  } else {
    ScoreAaaah.findAll({
      order: [['win', 'DESC']],
      where: {
        date: date
      },
      attributes: ['player.name', 'win', 'total', 'guiding', 'guiding_ratio', 'kill'],
      include: [{ model: Player, attributes: ['name'] }],
      
    }).then(scores => {
      res.send(scores);
    });
  }
});

module.exports = router;
