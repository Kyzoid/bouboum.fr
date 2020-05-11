const Database = require('./Database');
const dayjs = require('dayjs');
require('dayjs/locale/fr');

class IndexController {
  constructor() {
    this.date = 
    this.todayDate = dayjs().format('YYYY-MM-DD');
  }

  ucFirst(str) {
    if (str.length > 0) {
      return str[0].toUpperCase() + str.substring(1);
    } else {
      return str;
    }
  }

  async ranking(req, res, next) {
    const database = new Database();
    database.open();
    const scores = await database.selectUsersAndScoreByDate(this.todayDate);
    database.close();

    scores.forEach(score => {
      score.username = this.ucFirst(score.username);
    });
    
    res.render('index', {
      scores: scores,
      date: dayjs().locale('fr').format('DD/MM/YYYY'),
    });
  }

}

module.exports = IndexController;