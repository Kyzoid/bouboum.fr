const express = require('express');
const fs = require('fs');
const router = express.Router();
const { Map, Tag } = require('../models/index');
const { ValidationError, json } = require('sequelize');
const { Op } = require("sequelize");

router.get('/', async (req, res, next) => {
  const tags = await Tag.findAll();
  res.render('editor/index', { tags: tags });
});

router.post('/telechargement', (req, res) => {
  const filename = `${req.body.name}`;
  const timestamp = Date.now();
  const file = fs.createWriteStream(`./dist/temp/${filename}_${timestamp}.txt`);
  file.write(req.body.map);
  file.end();

  res.send({ filename: filename, timestamp: timestamp });
});

router.post('/soumettre', (req, res) => {
  Map.findAll(
    {
      where: {
        [Op.or]: [{ name: req.body.name }, { map: req.body.map }]
      }
    }
  ).then(response => {
    if (response.length >= 1) {
      res.status(409).json({ message: 'Ce titre ou cette carte existe déjà ! Essayez de changer votre titre.' });
    }

    if (response.length === 0) {
      Map.create(req.body)
        .then(map => {
          map.createTag(JSON.parse(req.body.tags));
          res.sendStatus(201)
        })
        .catch((error) => {
          if (error instanceof ValidationError) {
            const errors = error.errors.reduce((acc, item) => {
              acc[item.path] = [...(acc[item.path] || []), item.message];
              return acc;
            }, {});
            res.status(400).json(errors);
          } else {
            res.status(500).send(error);
          }
        });
    }
  });
});

module.exports = router;
