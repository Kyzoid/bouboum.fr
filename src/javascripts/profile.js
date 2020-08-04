const playerId = document.getElementById('player').dataset.playerId;

const getBouboumRankings = async () => {
    return await fetch(`/profil/${playerId}/bouboum`, { method: 'GET' }).then((res) => res.json());
};

const getAaaahRankings = async () => {
    return await fetch(`/profil/${playerId}/aaaah`, { method: 'GET' }).then((res) => res.json());
};

const chartPoints = [];
const data = {
    labels: [],
    series: [
        chartPoints
    ]
};

const options = {
    width: 700,
    height: 300
};

getBouboumRankings().then(async (bouboumRankings) => {
    if (bouboumRankings.length) {
        bouboumRankings.forEach(bouboumRanking => {
            chartPoints.push(bouboumRanking.win);
        });
    } else {
        const aaaahRankings = await getAaaahRankings();
        aaaahRankings.forEach(aaaahRanking => {
            chartPoints.push(aaaahRanking.win);
        });
    }
    console.log(chartPoints)
    new Chartist.Line('.ct-chart', data, options);
});
