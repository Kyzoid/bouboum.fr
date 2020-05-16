const express = require('express');
const IndexController = require('../controllers/IndexController');
const Index = new IndexController();
const router = express.Router();
const Database = require('../controllers/Database');
const dayjs = require('dayjs');
require('dayjs/locale/fr');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/bouboum', (req, res, next) => {
  Index.ranking(req, res, next)
});

router.get('/aaaah', (req, res, next) => {
  Index.ranking(req, res, next)
});

router.get('/match', (req, res, next) => {
  res.render('match');
});

router.get('/ranking', async (req, res, next) => {
  try {
    const date = (req.query.date) ? req.query.date : dayjs().format('YYYY-MM-DD');
    const game = req.query.game;
    const database = new Database();
    database.open();
    let scores;
    if (game === 'bouboum') {
      scores = await database.selectBouboumUsersAndScoreByDate(date);
    } else {
      scores = await database.selectAaaahUsersAndScoreByDate(date);
    }
    database.close();
    res.send(scores);
  } catch (e) {
    
  }
});

module.exports = router;
