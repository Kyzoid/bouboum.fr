const fs = require('fs').promises;
const Player = require('../models/Player');
const ScoreBouboum = require('../models/ScoreBouboum');
const ScoreAaaah = require('../models/ScoreAaaah');

const args = process.argv.slice(2);
const game = args[0];
const fileDirectory = `./data/${game}.txt`;

const Score = (game.toLowerCase() === 'bouboum') ? ScoreBouboum : ScoreAaaah;

console.log(`Synchronisation ${game} en cours...`);

const removeDuplicates = (array) => {
  return array.filter((a, b) => array.indexOf(a) === b)
};

const formatData = async () => {
  const data = await fs.readFile(fileDirectory, 'utf8');

  let scoresToInsert = [];
  let playersToInsert = [];

  if (data) {
    const regex = /\[(.*?)\]/g;
    const rawRankings = data.match(regex);
    let date = null;

    rawRankings.forEach(rawRanking => {
      rawRanking = rawRanking.substring(1, rawRanking.length - 1);
      let userStats = rawRanking.split(';');
      date = userStats[0];
      userStats.shift();

      userStats.forEach(userStat => {
        userStat = userStat.split(',');
        userStat[0] = userStat[0].toLowerCase();
        userStat[userStat.length] = date;

        playersToInsert.push(userStat[0]);

        if (game.toLowerCase() === 'bouboum') {
          scoresToInsert.push({
            'player': userStat[0],
            'total': userStat[1],
            'win': userStat[2],
            'ratio': userStat[3],
            'date': userStat[4]
          });
        }

        if (game.toLowerCase() === 'aaaah') {
          scoresToInsert.push({
            'player': userStat[0],
            'total': userStat[1],
            'guiding': userStat[2],
            'win': userStat[3],
            'win_ratio': userStat[4],
            'guiding_ratio': userStat[5],
            'kill': userStat[6],
            'date': userStat[7],
          });
        }

      });
    });

    return { playersToInsert, scoresToInsert };
  }
};

const insertPlayers = async (playersToInsert, scoresToInsert) => {
  let creationCounter = 0;
  const players = removeDuplicates(playersToInsert);
  const playersJSON = [];
  players.forEach((player) => {
    playersJSON.push({ name: player })
  });

  playersJSON.forEach((player) => {
    Player.findOrCreate({
      where: {
        name: player.name
      }
    }).then((res) => {
      const playerName = res[0].dataValues.name;
      const created = res[1];

      if (!created) {
        console.log(`Erreur : L'utilisateur ${playerName} existe déjà !`);
      } else {
        console.log(`Le joueur ${playerName} a été créé.`);
      }
      creationCounter++;

      if (creationCounter === playersJSON.length) {
        insertScores(scoresToInsert);
      }
    });
  });
};

const insertScores = async (scoresToInsert) => {
  const allPlayers = [];
  Player.findAll().then((players) => {
    players.forEach((player) => {
      allPlayers.push({id: player.id, name: player.name});
    });
    
    scoresToInsert.forEach(score => {
      const index = allPlayers.findIndex(player => player.name === score.player);
      const player = allPlayers[index];
      delete score.player;
      score['player_id'] = player.id;

      Score.findOrCreate({ where: score });
    });
  });
};

formatData().then(async (data) => {
  const { playersToInsert, scoresToInsert } = data;
  insertPlayers(playersToInsert, scoresToInsert);
});
