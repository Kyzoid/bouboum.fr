const playerId = document.getElementById('player').dataset.playerId;

const getBouboumRankings = async () => {
  return await fetch(`/profil/${playerId}/bouboum`, { method: 'GET' }).then((res) => res.json());
};

const getAaaahRankings = async () => {
  return await fetch(`/profil/${playerId}/aaaah`, { method: 'GET' }).then((res) => res.json());
};

const formattedBouboumPlayersDataForChartist = (bouboumRankings) => {
  return {
    mode: 'Bouboum',
    win: bouboumRankings.map(bouboumRanking => bouboumRanking.win),
    ratio: bouboumRankings.map(bouboumRanking => bouboumRanking.ratio),
    total: bouboumRankings.map(bouboumRanking => bouboumRanking.total),
    winRatio: bouboumRankings.map(bouboumRanking => ((bouboumRanking.win/bouboumRanking.total)*100).toFixed(2)),
  }
};

const formattedAaaahPlayersDataForChartist = (aaaahRankings) => {
  return {
    mode: 'Aaaah',
    win: aaaahRankings.map(aaaahRanking => aaaahRanking.win),
    winRatio: aaaahRankings.map(aaaahRanking => aaaahRanking.win_ratio/100),
    guiding: aaaahRankings.map(aaaahRanking => aaaahRanking.guiding),
    kill: aaaahRankings.map(aaaahRanking => aaaahRanking.kill),
    guidingRatio: aaaahRankings.map(aaaahRanking => aaaahRanking.guiding_ratio),
    total: aaaahRankings.map(aaaahRanking => aaaahRanking.total)
  }
};

const drawChart = (rankings, key) => {
  const data = {
    labels: [],
    series: [
      rankings[key],
    ]
  };

  const options = {
    width: 700,
    height: 300
  };

  new Chartist.Line('.ct-chart', data, options);
};

let bouboumData = null;
let aaaahData = null;

getBouboumRankings().then(async (bouboumRankings) => {
  if (bouboumRankings.length) {
    bouboumData = formattedBouboumPlayersDataForChartist(bouboumRankings);
    drawChart(formattedBouboumPlayersDataForChartist(bouboumRankings), 'win');
  } else {
    const aaaahRankings = await getAaaahRankings();
    aaaahData = formattedAaaahPlayersDataForChartist(aaaahRankings);
    drawChart(formattedAaaahPlayersDataForChartist(aaaahRankings), 'win');
  }
});

const chartistButtons = document.getElementsByClassName('chartist-button');
Object.values(chartistButtons).forEach(chartistButton => {
  chartistButton.addEventListener('click', (event) => {
    const key = event.target.dataset.key;
    if (bouboumData !== null) {
      drawChart(bouboumData, key);
    }
  });
});