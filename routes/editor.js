const express = require('express');
const fs = require('fs');
const EditorController = require('../controllers/EditorController');
const Editor = new EditorController();
const router = express.Router();
require('dayjs/locale/fr');

router.get('/', (req, res, next) => {
  Editor.index(req, res, next);
});

router.post('/download', (req, res) => {
  const filename = `${req.body.name}`;
  const timestamp = Date.now();
  const file = fs.createWriteStream(`./dist/temp/${filename}_${timestamp}.txt`);
  file.write(req.body.map);
  file.end();

  res.send({filename: filename, timestamp: timestamp});
});

module.exports = router;