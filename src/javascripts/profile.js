const playerId = document.getElementById('player').dataset.playerId;

const chartNames = {
  'bouboum-rank': 'Classement - Bouboum',
  'bouboum-ratio': 'TPS - Bouboum',
  'bouboum-win': 'Victoires - Bouboum',
  'bouboum-win-ratio': 'Pourcentage de victoire - Bouboum',
  'bouboum-total': 'Parties jouées - Bouboum',
  'aaaah-rank': 'Classement - Aaaah !',
  'aaaah-kill': 'Tués - Aaaah !',
  'aaaah-win': 'Victoires - Aaaah !',
  'aaaah-win-ratio': 'Pourcentage de victoires - Aaaah !',
  'aaaah-guiding': 'Guidages - Aaaah !',
  'aaaah-guiding-ratio': 'Pourcentage de guidages - Aaaah !',
  'aaaah-total': 'Parties jouées - Aaaah !'
};

const getBouboumRankings = async () => {
  return await fetch(`/profil/${playerId}/bouboum`, { method: 'GET' }).then((res) => res.json());
};

const getAaaahRankings = async () => {
  return await fetch(`/profil/${playerId}/aaaah`, { method: 'GET' }).then((res) => res.json());
};

const formattedBouboumPlayersDataForChartist = (bouboumRankings) => {
  return {
    'bouboum-rank': bouboumRankings.map(bouboumRanking => bouboumRanking.rank),
    'bouboum-win': bouboumRankings.map(bouboumRanking => bouboumRanking.win),
    'bouboum-ratio': bouboumRankings.map(bouboumRanking => bouboumRanking.ratio / 100),
    'bouboum-total': bouboumRankings.map(bouboumRanking => bouboumRanking.total),
    'bouboum-win-ratio': bouboumRankings.map(bouboumRanking => ((bouboumRanking.win / bouboumRanking.total) * 100).toFixed(2)),
  }
};

const formattedAaaahPlayersDataForChartist = (aaaahRankings) => {
  return {
    'aaaah-rank': aaaahRankings.map(aaaahRanking => aaaahRanking.rank),
    'aaaah-win': aaaahRankings.map(aaaahRanking => aaaahRanking.win),
    'aaaah-win-ratio': aaaahRankings.map(aaaahRanking => aaaahRanking.win_ratio / 100),
    'aaaah-guiding': aaaahRankings.map(aaaahRanking => aaaahRanking.guiding),
    'aaaah-kill': aaaahRankings.map(aaaahRanking => aaaahRanking.kill),
    'aaaah-guiding-ratio': aaaahRankings.map(aaaahRanking => aaaahRanking.guiding_ratio / 100),
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

const rankOptions = {
  width: 700,
  height: 300,
  series: {
    'series-1': {
      lineSmooth: Chartist.Interpolation.simple()
    }
  },
  axisY: {
    labelInterpolationFnc: (value) => {
      return -value+1;
    }
  }
};

let bouboumData = null;
let aaaahData = null;

const chartName = document.getElementById('chart-name');
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
    if (className === 'bouboum-rank' || className === 'aaaah-rank') {
      new Chartist.Line(`.${className}`, chartistData(data), rankOptions).on('data', (context) => {
        context.data.series[0].data = context.data.series[0].data.map((value) => -value);
      });
    } else {
      new Chartist.Line(`.${className}`, chartistData(data), options);
    }
    
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
    chartName.innerText = 'Classement - Bouboum';
  } else {
    document.querySelector('.aaaah-rank').classList.remove('hidden');
    chartName.innerText = 'Classement - Aaaah !';
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
  chartName.innerText = chartNames[key];
  document.querySelector(`.${key}`).classList.remove('hidden');
};

const chartistButtons = document.getElementsByClassName('chartist-button');
Object.values(chartistButtons).forEach(chartistButton => {
  chartistButton.addEventListener('click', showChart);
});
