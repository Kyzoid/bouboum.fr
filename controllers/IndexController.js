const dayjs = require('dayjs');
require('dayjs/locale/fr');

class IndexController {
  constructor() {
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
    const isBouboum = req.url.includes('bouboum');
    const game = isBouboum ? 'Bouboum' : 'Aaaah';

    res.render('ranking', {
      date: dayjs().locale('fr').format('DD/MM/YYYY'),
      game: game
    });
  }

}

module.exports = IndexController;