const express = require('express');
const dayjs = require('dayjs');
const { ValidationError } = require('sequelize');

const router = express.Router();
const { Tag, Poll, Map } = require('../models/index');

router.get('/', (req, res) => {
  let tags = {};
  Poll.findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: Tag,
      attributes: ['name'],
    }]
  }).then((data) => {
    if (data) {
      data.forEach(poll => {
        const startAtTS = poll.dataValues.startAt.getTime();
        const endAtTS = poll.dataValues.endAt.getTime();

        const now = Date.now();

        if (now >= startAtTS && now <= endAtTS) {
          poll.status = 'ongoing';
        }

        if (now < startAtTS) {
          poll.status = 'soon';
        }

        if (now > endAtTS) {
          poll.status = 'ended';
        }

        poll.dataValues.startAt = dayjs(poll.dataValues.startAt).locale('fr').format('DD MMMM YYYY');
        poll.dataValues.endAt = dayjs(poll.dataValues.endAt).locale('fr').format('DD MMMM YYYY');
      });
    }
    Tag.findAll().then(tags => res.render('polls/index', { polls: data, tags: tags, admin: !!req.session.userId }));

  });

});

router.post('/', async (req, res) => {

  Poll.create(req.body)
    .then(async (poll) => {
      const tag = await Tag.findByPk(req.body.tag);
      await poll.setTag(tag);
      res.redirect('/sondages');
    })
    .catch((error) => {
      console.log(error)
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

router.get('/:id', (req, res) => {
  Poll.findByPk(
    req.params.id,
    {
      include: [{
        model: Tag,
        attributes: ['name'],
      }]
    }).then(async (data) => {
      if (data) {
        data.startAtTS = data.dataValues.startAt.getTime();
        data.endAtTS = data.dataValues.endAt.getTime();

        const now = Date.now();

        if (now >= data.startAtTS && now <= data.endAtTS) {
          data.status = 'ongoing';
        }

        if (now < data.startAtTS) {
          data.status = 'soon';
        }

        if (now > data.endAtTS) {
          data.status = 'ended';
        }

        data.dataValues.startAt = dayjs(data.dataValues.startAt).locale('fr').format('DD MMMM YYYY');
        data.dataValues.endAt = dayjs(data.dataValues.endAt).locale('fr').format('DD MMMM YYYY');

        const maps = await Map.findAll({
          order: [
            ['createdAt', 'DESC']
          ],
          include: [{
            model: Tag,
            where: {
              name: data.dataValues.tag.name
            },
            attributes: ['name'],
          }]
        }).then((data) => {
          data.forEach(map => {
            map.dataValues.createdAt = dayjs(map.dataValues.createdAt).locale('fr').format('DD MMMM YYYY');
          });
          return data;
        });

        res.render('polls/poll', { poll: data, maps: maps, admin: !!req.session.userId });

      } else {
        res.sendStatus(404);
      }
    }).catch(err => res.sendStatus(500));
});

module.exports = router;
