const addDiv = (element, content) => {
  const div = document.createElement('div');
  div.classList.add('player');
  const span = document.createElement('span');
  span.textContent = content;
  div.append(span);
  element.append(div);
}

(function () {
  const teamOnePlayerList = JSON.parse(localStorage.getItem('team-one'));
  const teamTwoPlayerList = JSON.parse(localStorage.getItem('team-two'));
  const teamOneName = localStorage.getItem('team-one-name');
  const teamTwoName = localStorage.getItem('team-two-name');
  const teamOneScore = localStorage.getItem('team-one-score');
  const teamTwoScore = localStorage.getItem('team-two-score');

  // LocalStorage : init
  if (teamOneName === null) {
    localStorage.setItem('team-one-name', 'Team 1')
  }
  if (teamTwoName === null) {
    localStorage.setItem('team-two-name', 'Team 2')
  }

  if (teamOnePlayerList === null) {
    localStorage.setItem('team-one', JSON.stringify([]));
  }
  if (teamTwoPlayerList === null) {
    localStorage.setItem('team-two', JSON.stringify([]));
  }

  if (teamOneScore === null) {
    localStorage.setItem('team-one-score', '0');
  }
  if (teamTwoScore === null) {
    localStorage.setItem('team-two-score', '0');
  }

  // FRONT : init team player lists
  if (teamOnePlayerList) {
    const teamOneFront = document.getElementById(`team-one-list`);
    teamOnePlayerList.forEach((playerName) => {
      addDiv(teamOneFront, playerName);
    });
  }

  if (teamTwoPlayerList) {
    const teamTwoFront = document.getElementById(`team-two-list`);
    teamTwoPlayerList.forEach((playerName) => {
      addDiv(teamTwoFront, playerName);
    });
  }

  // FRONT : init teams title
  const teamOneTitle = document.getElementById('team-one-title');
  const teamTwoTitle = document.getElementById('team-two-title');
  const teamOneVersusTitle = document.getElementById('team-one-versus-title');
  const teamTwoVersusTitle = document.getElementById('team-two-versus-title');
  teamOneTitle.textContent = localStorage.getItem('team-one-name');
  teamTwoTitle.textContent = localStorage.getItem('team-two-name');
  teamOneVersusTitle.textContent = localStorage.getItem('team-one-name');
  teamTwoVersusTitle.textContent = localStorage.getItem('team-two-name');

  // FRONT : init teams score
  const frontTeamOneScore = document.getElementById('team-one-score');
  const frontTeamTwoScore = document.getElementById('team-two-score');
  frontTeamOneScore.textContent = localStorage.getItem('team-one-score');
  frontTeamTwoScore.textContent = localStorage.getItem('team-two-score');

})();

const addPlayerToLS = (team, player) => {
  const teamPlayerList = JSON.parse(localStorage.getItem(team));
  teamPlayerList.push(player);
  localStorage.setItem(team, JSON.stringify(teamPlayerList));
}

const addPlayer = (event) => {
  const team = event.target.dataset.team;
  const input = document.getElementById(`${team}-input`);
  const teamPlayerList = document.getElementById(`${team}-list`);
  const playerName = input.value;

  addDiv(teamPlayerList, playerName);
  addPlayerToLS(team, playerName);

  input.value = '';
};

const editTeamName = (event) => {
  const team = event.target.dataset.team;
  const input = document.getElementById(`${team}-name`);
  const teamTitle = document.getElementById(`${team}-title`);
  const teamVersusTitle = document.getElementById(`${team}-versus-title`);
  const teamName = input.value;

  teamTitle.textContent = teamName;
  teamVersusTitle.textContent = teamName;
  localStorage.setItem(`${team}-name`, teamName);

  input.value = '';
};

const editTeamScore = (event) => {
  const team = event.target.dataset.team;
  const input = document.getElementById(`${team}-number`);
  const frontTeamScore = document.getElementById(`${team}-score`);
  const teamScore = input.value;

  frontTeamScore.textContent = teamScore;
  localStorage.setItem(`${team}-score`, teamScore);
};

// init input player
Object.values(document.getElementsByClassName('add-player-button')).forEach((element) => {
  element.addEventListener('click', addPlayer);
});

// init input team title
Object.values(document.getElementsByClassName('edit-team-name')).forEach((element) => {
  element.addEventListener('click', editTeamName);
});

// init input score
Object.values(document.getElementsByClassName('edit-team-score')).forEach((element) => {
  element.addEventListener('click', editTeamScore);
});