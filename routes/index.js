const express = require('express');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
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

router.get('/match', (req, res, next) => {
  res.render('match');
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

router.post('/add-data', auth, (req, res, next) => {
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

router.all('/admin', auth, (req, res, next) => {
  res.render('admin');
});

async function auth(req, res, next) {
  if (req.method === 'POST') {
    const username = req.body.username;
    const database = new Database();
    database.open();
    const admin = await database.selectAdminUser(username);
    database.close();

    if (req.body.password && admin.length) {
      if (await bcrypt.compare(req.body.password || '', admin[0].password || '')) {
        next();
      } else {
        res.render('auth', { err: "Où est-ce que tu essayes d'entrer sale fou ?!" });
      }
    } else {
      res.render('auth', { err: "Où est-ce que tu essayes d'entrer sale fou ?!" });
    }
  } else {
    res.render('auth');
  }

  
}

module.exports = router;
