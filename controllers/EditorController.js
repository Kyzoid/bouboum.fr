const Database = require('./Database');

class EditorController {
  constructor() {
    
  }

  index(req, res, next) {
    res.render('editor/index');
  }

}

module.exports = EditorController;