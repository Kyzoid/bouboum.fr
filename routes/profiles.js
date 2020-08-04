const express = require('express');
const router = express.Router();
const { ScoreBouboum, ScoreAaaah, Player } = require('../models/index');
const dayjs = require('dayjs');

router.get('/:id', async (req, res) => {
    const bouboumScores = await ScoreBouboum.findOne({
        where: {
            player_id: req.params.id
        },
        order: [
            ['date', 'DESC']
        ]
    });

    const aaaahScores = await ScoreAaaah.findOne({
        where: {
            player_id: req.params.id
        },
        order: [
            ['date', 'DESC']
        ]
    });

    Player.findByPk(req.params.id)
        .then(async (data) => {
            if (data) {
                data.dataValues.createdAt = dayjs(data.dataValues.createdAt).locale('fr').format('DD MMMM YYYY');
                res.render('profiles/index', { player: data, aaaahScores: aaaahScores, bouboumScores: bouboumScores });

            } else {
                res.sendStatus(404);
            }
        }).catch(err => res.sendStatus(500));
});

router.get('/:id/aaaah', async (req, res) => {
    const aaaahScores = await ScoreAaaah.findAll({
        where: {
            player_id: req.params.id
        },
        order: [
            ['date', 'ASC']
        ]
    });

    res.json(aaaahScores);
});

router.get('/:id/bouboum', async (req, res) => {
    const bouboumScores = await ScoreBouboum.findAll({
        where: {
            player_id: req.params.id
        },
        order: [
            ['date', 'ASC']
        ]
    });

    res.json(bouboumScores);
});

module.exports = router;
