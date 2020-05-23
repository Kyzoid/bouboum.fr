const Database = require('./Database');

class EditorController {

  index(req, res, next) {
    res.render('editor/index');
  }

}

module.exports = EditorController;