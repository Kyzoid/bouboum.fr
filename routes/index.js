const express = require('express');
const IndexController = require('../controllers/IndexController');
const Index = new IndexController();
const router = express.Router();
const Database = require('../controllers/Database');
const dayjs = require('dayjs');
require('dayjs/locale/fr');

/* GET home page. */
router.get('/', (req, res, next) => {
    Index.ranking(req, res, next)
});

router.get('/bouboum_ranking', async (req, res, next) => {
    try {
        const date = (req.query.date) ? req.query.date : dayjs().format('YYYY-MM-DD');
        const database = new Database();
        database.open();
        const scores = await database.selectUsersAndScoreByDate(date);
        database.close();
        res.send(scores);
    } catch(e) {
      res.status(500).send(e);
    }
});
module.exports = router;
