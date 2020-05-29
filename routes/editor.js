const express = require('express');
const fs = require('fs');
const EditorController = require('../controllers/EditorController');
const Editor = new EditorController();
const router = express.Router();
const {ValidationError} = require('sequelize');

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

router.post('/map', (req, res) => {
  Map.create(req.body)
  .then(data => console.log('create user', data) || res.sendStatus(201))
  .catch((error) => {
    if (error instanceof ValidationError) {
      const errors = error.errors.reduce((acc, item) => {
        acc[item.path] = [...(acc[item.path] || []), item.message];
        return acc;
      }, {});
      res.status(400).json(errors);
    } else {
      res.sendStatus(500);
    }
  });
});

router.get('/map', (req, res) => {
  Map.findAll().then((data) => res.json(data));
});

router.get('/map/:id', (req, res) => {
  Map.findByPk(req.params.id).then((data) => data ? res.json(data) : res.sendStatus(404))
  .catch(err => res.sendStatus(500));
});

router.delete('/map/:id', (req, res) => {
  Map.findByPk(req.params.id).then((data) => data ? res.json(data) : res.sendStatus(404))
  .catch(err => res.sendStatus(500));
});

module.exports = router;