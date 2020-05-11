const express = require('express');
const IndexController = require('../controllers/IndexController');
const Index = new IndexController();
const router = express.Router();
const Database = require('../controllers/Database');
const dayjs = require('dayjs');
const fs = require('fs');
require('dayjs/locale/fr');

/* GET home page. */
router.get('/', (req, res, next) => {
  Index.ranking(req, res, next)
});

router.get('/bouboum-ranking', async (req, res, next) => {
  try {
    const date = (req.query.date) ? req.query.date : dayjs().format('YYYY-MM-DD');
    const database = new Database();
    database.open();
    const scores = await database.selectUsersAndScoreByDate(date);
    database.close();
    res.send(scores);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/add-data', (req, res, next) => {
  try {
    const data = req.body;
    if (Object.keys(data).length) {
      const file = `./data/${req.body.ranking}.txt`;
      console.log(req.body)
      if (req.body.type === 'write') {
        fs.writeFile(file, data.data, err => {
          if (err) { throw new Error('fs.writeFile() error.') }
          res.sendStatus(200);
        });
      } else {
        fs.appendFile(file, data.data, err => {
          if (err) { throw new Error('fs.appendFile() error.') }
          res.sendStatus(200);
        });
      }

    } else {
      throw new Error('req.body is empty.')
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/data', (req, res, next) => {
  res.render('data');
});

module.exports = router;
