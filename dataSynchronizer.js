const fileDirectory = "./data/bouboum.txt";
const fs = require('fs').promises;
const Database = require('./controllers/Database');

const db = new Database();
db.open();

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
        //usersToInsert.push(username);
        scoresToInsert.push(userStat);
      });
    });
    
    //usersToInsert = removeDuplicates(usersToInsert);
    
    return scoresToInsert;
  }

};

formatData().then( async (scores) => {
  let endedQueries = 0;

  for (score of scores) {
    await db.insertScore(score);
  }

});

