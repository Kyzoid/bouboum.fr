const express = require('express');
const EditorController = require('../controllers/EditorController');
const Editor = new EditorController();
const router = express.Router();
require('dayjs/locale/fr');

router.get('/', (req, res, next) => {
  Editor.index(req, res, next);
});

module.exports = router;
