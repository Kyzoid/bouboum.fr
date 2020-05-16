const fs = require('fs').promises;
const Database = require('./controllers/Database');

const args = process.argv.slice(2);
const game = args[0];

const fileDirectory = `./data/${game}.txt`;

const db = new Database();
db.open();

console.log(`Synchronisation ${game} en cours...`);

const formatData = async () => {
  const data = await fs.readFile(fileDirectory, 'utf8');
  let scoresToInsert = [];
  
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
        scoresToInsert.push(userStat);
      });
    });

    return scoresToInsert;
  }

};

formatData().then( async (scores) => {
  let endedQueries = 0;

  for (score of scores) {
    if (game === 'bouboum') {
      await db.insertBouboumScore(score, game);
    }
    if (game === 'aaaah') {
      await db.insertAaaahScore(score, game);
    }
  }

  db.close();
  console.log(`Synchronisation ${game} terminée.`);
});
