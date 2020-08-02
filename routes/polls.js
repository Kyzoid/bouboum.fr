const express = require('express');
const dayjs = require('dayjs');
const sort = require('fast-sort');
const { ValidationError } = require('sequelize');

const router = express.Router();
const { Tag, Poll, Map, Vote } = require('../models/index');

const checkVotePermission = async (req, res, next) => {
  const poll = await Poll.findByPk(
    req.params.pollId,
    {
      include: [{
        model: Tag,
        attributes: ['name'],
      }]
    });

  const maps = await Map.findAll({
    include: [{
      model: Tag,
      where: {
        name: poll.dataValues.tag.name
      },
      attributes: ['name'],
    }]
  });

  const votes = await Vote.findAll({
    where: {
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      poll_id: req.params.pollId
    }
  });

  if (votes.length < Math.ceil(maps.length * 0.1)) {
    next();
  } else {
    res.status(403).send({ error: "Vous n'avez plus de votes à attribuer." })
  }
};

router.get('/', async (req, res) => {
  const polls = await Poll.findAll({
    order: [
      ['endAt', 'DESC']
    ],
    include: [{
      model: Tag,
      attributes: ['name'],
    }]
  });

  if (polls) {
    polls.forEach(poll => {
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

  Tag.findAll().then(tags => res.render('polls/index', { polls: polls, tags: tags, admin: !!req.session.userId }));
});

const isAdmin = (req, res, next) => {
  if (!req.session.userId) {
    res.sendStatus(401);
  } else {
    next();
  }
};

router.post('/', async (req, res) => {
  Poll.create(req.body)
    .then(async (poll) => {
      const tag = await Tag.findByPk(req.body.tag);
      await poll.setTag(tag);
      res.redirect('/sondages');
    })
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

router.get('/:id', async (req, res) => {
  const votesStatus = [];
  const poll = await Poll.findByPk(req.params.id,
    {
      include: [{
        model: Tag,
        attributes: ['name'],
      }]
    });

  if (poll) {
    poll.startAtTS = poll.dataValues.startAt.getTime();
    poll.endAtTS = poll.dataValues.endAt.getTime();
    const now = Date.now();
    if (now >= poll.startAtTS && now <= poll.endAtTS) { poll.status = 'ongoing' }
    if (now < poll.startAtTS) { poll.status = 'soon' }
    if (now > poll.endAtTS) { poll.status = 'ended' }
    poll.dataValues.startAt = dayjs(poll.dataValues.startAt).locale('fr').format('DD MMMM YYYY');
    poll.dataValues.endAt = dayjs(poll.dataValues.endAt).locale('fr').format('DD MMMM YYYY');

    const votesCount = await Vote.count({
      where: {
        poll_id: req.params.id,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }
    });

    const totalVotesNumber = await Vote.count({
      where: {
        poll_id: req.params.id
      }
    });

    const maps = await Map.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: Tag,
        where: {
          name: poll.dataValues.tag.name
        },
        attributes: ['name'],
      }]
    });

    const votesStatusPromise = new Promise((resolve, reject) => {
      maps.forEach(async (map, index) => {
        map.dataValues.createdAt = dayjs(map.dataValues.createdAt).locale('fr').format('DD MMMM YYYY');
        map.votes = await Vote.count({
          where: {
            poll_id: req.params.id,
            map_id: map.id
          }
        });

        const vote = await Vote.findAll({
          where: {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            map_id: map.dataValues.id,
            poll_id: req.params.id
          }
        });

        votesStatus[map.dataValues.id] = vote.length ? true : false;

        if (index === maps.length - 1) resolve();
      });
    });

    votesStatusPromise.then(() => {
      if (poll.status === 'ended' || !!req.session.userId) {
        sort(maps).desc(map => map.votes);
      }

      res.render('polls/poll', {
        poll: poll,
        votesNumber: votesCount,
        votesStatus: votesStatus,
        totalVotesNumber: totalVotesNumber,
        maps: maps,
        admin: !!req.session.userId
      })
    });

  } else {
    res.sendStatus(404);
  }
});

router.post('/:pollId/vote/:mapId', checkVotePermission, (req, res) => {
  Vote.findOrCreate({
    where: {
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      poll_id: req.params.pollId,
      map_id: req.params.mapId
    }
  }).then(async (vote) => {
    if (vote[1]) {
      const poll = await Poll.findByPk(req.params.pollId);
      await poll.addVote(vote[0]);
      const map = await Map.findByPk(req.params.mapId);
      await map.addVote(vote[0]);
      res.status(200).send({});
    } else {
      res.status(409).send({ error: 'Vous avez déjà voté pour cette carte.' })
    }
  }).catch((err) => {
    res.status(500).send({ error: err });
  });
});

router.delete('/:pollId/vote/:mapId', (req, res) => {
  Vote.destroy({
    where: {
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      map_id: req.params.mapId,
      poll_id: req.params.pollId
    }
  }).then(() => {
    res.sendStatus(204);
  });
});

router.delete('/:id', isAdmin, (req, res) => {
  Poll.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((response) => {
      if (response) {
        res.sendStatus(204)
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => console.log(err));
});

module.exports = router;
