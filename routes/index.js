const express = require('express');
const dayjs = require('dayjs');

const router = express.Router();
const Player = require('../models/Player');
const ScoreBouboum = require('../models/ScoreBouboum');
const ScoreAaaah = require('../models/ScoreAaaah');
require('dayjs/locale/fr');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/classements/bouboum', (req, res, next) => {
  res.render('ranking', {
    date: dayjs().locale('fr').format('DD/MM/YYYY'),
    game: 'Bouboum'
  });
});

router.get('/classements/aaaah', (req, res, next) => {
  res.render('ranking', {
    date: dayjs().locale('fr').format('DD/MM/YYYY'),
    game: 'Aaaah !'
  });
});

router.get('/match', (req, res, next) => {
  res.render('match');
});

router.get('/classement', async (req, res, next) => {
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
