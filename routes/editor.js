const express = require('express');
const fs = require('fs');
const router = express.Router();
const Map = require('../models/Map');
const Tag = require('../models/Tag');
const { ValidationError } = require('sequelize');
const { Op } = require("sequelize");

router.get('/', (req, res, next) => {
  res.render('editor/index');
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
        [Op.or]: [{ name: req.body.name }, { path: req.body.path }]
      }
    }
  ).then(response => {
    if (response.length >= 1) {
      res.status(409).json({ message: 'La carte que vous essayez de soumettre existe déjà. Essayez de changer le titre de la carte sinon ça veut dire que votre carte existe déjà.' });
    }

    if (response.length === 0) {
      Map.create(req.body)
        .then(response => res.sendStatus(201))
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
    }
  });
});

module.exports = router;
