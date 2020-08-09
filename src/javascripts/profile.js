const playerId = document.getElementById('player').dataset.playerId;

const getBouboumRankings = async () => {
  return await fetch(`/profil/${playerId}/bouboum`, { method: 'GET' }).then((res) => res.json());
};

const getAaaahRankings = async () => {
  return await fetch(`/profil/${playerId}/aaaah`, { method: 'GET' }).then((res) => res.json());
};

const formattedBouboumPlayersDataForChartist = (bouboumRankings) => {
  console.log(bouboumRankings)
  return {
    'bouboum-rank': bouboumRankings.map(bouboumRanking => bouboumRanking.rank),
    'bouboum-win': bouboumRankings.map(bouboumRanking => bouboumRanking.win),
    'bouboum-ratio': bouboumRankings.map(bouboumRanking => bouboumRanking.ratio/100),
    'bouboum-total': bouboumRankings.map(bouboumRanking => bouboumRanking.total),
    'bouboum-win-ratio': bouboumRankings.map(bouboumRanking => ((bouboumRanking.win / bouboumRanking.total) * 100).toFixed(2)),
  }
};

const formattedAaaahPlayersDataForChartist = (aaaahRankings) => {
  return {
    'aaaah-rank': aaaahRankings.map(aaaahRanking => aaaahRanking.rank),
    'aaaah-win': aaaahRankings.map(aaaahRanking => aaaahRanking.win),
    'aaaah-win-ratio': aaaahRankings.map(aaaahRanking => aaaahRanking.win_ratio/100),
    'aaaah-guiding': aaaahRankings.map(aaaahRanking => aaaahRanking.guiding),
    'aaaah-kill': aaaahRankings.map(aaaahRanking => aaaahRanking.kill),
    'aaaah-guiding-ratio': aaaahRankings.map(aaaahRanking => aaaahRanking.guiding_ratio/100),
    'aaaah-total': aaaahRankings.map(aaaahRanking => aaaahRanking.total)
  }
};

const chartistData = (data) => {
  return {
    labels: [],
    series: [
      {
        name: 'series-1',
        data: data,
      }
    ]
  };
};

const options = {
  width: 700,
  height: 300,
  series: {
    'series-1': {
      lineSmooth: Chartist.Interpolation.simple()
    }
  }
};

let bouboumData = null;
let aaaahData = null;

const drawCharts = (gameData, charts, game) => {
  Object.values(gameData).forEach((data, i) => {
    const className = Object.keys(gameData)[i];
    if (document.querySelector(`.${className}`) === null) {
      const div = document.createElement('div');
      div.classList.add('absolute');
      div.classList.add('hidden');
      div.classList.add(className);
      charts.appendChild(div);
    }
    new Chartist.Line(`.${className}`, chartistData(data), options);
  });
};

(async () => {
  const bouboumRankings = await getBouboumRankings();
  bouboumData = formattedBouboumPlayersDataForChartist(bouboumRankings)
  const aaaahRankings = await getAaaahRankings();
  aaaahData = formattedAaaahPlayersDataForChartist(aaaahRankings);

  const charts = document.getElementById('charts');
  drawCharts(bouboumData, charts, 'bouboum');
  drawCharts(aaaahData, charts, 'aaaah');

  if (bouboumRankings.length > 0) {
    document.querySelector('.bouboum-rank').classList.remove('hidden');
  } else {
    document.querySelector('.aaaah-rank').classList.remove('hidden');
  }
})();

const showChart = (event) => {
  const key = event.target.dataset.key;
  const allCharts = document.getElementById('charts').childNodes;
  
  allCharts.forEach(chart => {
    if (!chart.classList.contains('hidden')) {
      chart.classList.add('hidden');
    }
  });

  document.querySelector(`.${key}`).classList.remove('hidden');
};

const chartistButtons = document.getElementsByClassName('chartist-button');
Object.values(chartistButtons).forEach(chartistButton => {
  chartistButton.addEventListener('click', showChart);
});
