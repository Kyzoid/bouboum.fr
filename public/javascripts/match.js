const teamOneTitle = document.getElementById('team-one-title');
const teamTwoTitle = document.getElementById('team-two-title');
const teamOneVersusTitle = document.getElementById('team-one-versus-title');
const teamTwoVersusTitle = document.getElementById('team-two-versus-title');
const frontTeamOneScore = document.getElementById('team-one-score');
const frontTeamTwoScore = document.getElementById('team-two-score');
const teamOnePlayerList = document.getElementById('team-one-list');
const teamTwoPlayerList = document.getElementById('team-two-list');
const teamOneNumber = document.getElementById('team-one-number');
const teamTwoNumber = document.getElementById('team-two-number');

const editPlayerName = (event) => {
  const playerName = event.target.textContent;
  const playerIndex = event.target.dataset.listIndex;
  const team = event.target.closest('.team').getAttribute('id');
  const teamList = JSON.parse(localStorage.getItem(team));
  teamList[playerIndex] = playerName;
  localStorage.setItem(team, JSON.stringify(teamList));
};

const addDiv = (element, content, index) => {
  const div = document.createElement('div');
  div.classList.add('player');
  const divTwo = document.createElement('div'); 
  divTwo.classList.add('h-4');
  const span = document.createElement('span');
  span.textContent = content;
  span.setAttribute('contenteditable', true);
  span.dataset.listIndex = index;
  span.addEventListener('input', editPlayerName);
  divTwo.append(span);
  div.append(divTwo);
  element.append(div);
}

const init = () => {
  let teamOnePlayerList = JSON.parse(localStorage.getItem('team-one'));
  let teamTwoPlayerList = JSON.parse(localStorage.getItem('team-two'));
  const teamOneTitleLS = localStorage.getItem('team-one-title');
  const teamTwoTitleLS = localStorage.getItem('team-two-title');
  const teamOneVersusTitleLS = localStorage.getItem('team-one-versus-title');
  const teamTwoVersusTitleLS = localStorage.getItem('team-two-versus-title');
  const teamOneScore = localStorage.getItem('team-one-score');
  const teamTwoScore = localStorage.getItem('team-two-score');

  // LocalStorage : init
  if (teamOneTitleLS === null) {
    localStorage.setItem('team-one-title', 'Team 1')
  }
  if (teamTwoTitleLS === null) {
    localStorage.setItem('team-two-title', 'Team 2')
  }

  if (teamOneVersusTitleLS === null) {
    localStorage.setItem('team-one-versus-title', 'Team 1')
  }
  if (teamTwoVersusTitleLS === null) {
    localStorage.setItem('team-two-versus-title', 'Team 2')
  }

  if (teamOnePlayerList === null) {
    localStorage.setItem('team-one', JSON.stringify([""]));
  }
  if (teamTwoPlayerList === null) {
    localStorage.setItem('team-two', JSON.stringify([""]));
  }

  if (teamOneScore === null) {
    localStorage.setItem('team-one-score', '0');
  }
  if (teamTwoScore === null) {
    localStorage.setItem('team-two-score', '0');
  }

  // FRONT : init team player lists
  teamOnePlayerList = JSON.parse(localStorage.getItem('team-one'));
  teamTwoPlayerList = JSON.parse(localStorage.getItem('team-two'));
  if (teamOnePlayerList) {
    const teamOneFront = document.getElementById(`team-one-list`);
    teamOnePlayerList.forEach((playerName, index) => {
      addDiv(teamOneFront, playerName, index);
    });
  }

  if (teamTwoPlayerList) {
    const teamTwoFront = document.getElementById(`team-two-list`);
    teamTwoPlayerList.forEach((playerName, index) => {
      addDiv(teamTwoFront, playerName, index);
    });
  }

  // FRONT : init teams title
  teamOneTitle.textContent = localStorage.getItem('team-one-title');
  teamTwoTitle.textContent = localStorage.getItem('team-two-title');
  teamOneVersusTitle.textContent = localStorage.getItem('team-one-versus-title');
  teamTwoVersusTitle.textContent = localStorage.getItem('team-two-versus-title');

  // FRONT : init teams score
  frontTeamOneScore.textContent = localStorage.getItem('team-one-score');
  frontTeamTwoScore.textContent = localStorage.getItem('team-two-score');
};

init();

const addPlayerToLS = (team, player) => {
  const teamPlayerList = JSON.parse(localStorage.getItem(team));
  teamPlayerList.push(player);
  localStorage.setItem(team, JSON.stringify(teamPlayerList));
}

const addPlayer = (event) => {
  const team = event.target.dataset.team;
  const teamPlayerList = (team === 'team-one') ? teamOnePlayerList : teamTwoPlayerList;
  const playerName = '';

  const teamLength = JSON.parse(localStorage.getItem(team)).length;

  addDiv(teamPlayerList, playerName, teamLength);
  addPlayerToLS(team, '');
};

const editTeamScore = (event) => {
  const team = event.target.dataset.team;
  const input = (team === 'team-one') ? teamOneNumber : teamTwoNumber; 
  const frontTeamScore = (team === 'team-one') ? frontTeamOneScore : frontTeamTwoScore;
  const teamScore = input.value;

  frontTeamScore.textContent = teamScore;
  localStorage.setItem(`${team}-score`, teamScore);
};

const editTeamName = (event) => {
  const teamName = event.target.textContent;
  const id = event.target.getAttribute('id');
  localStorage.setItem(id, teamName);
};

// init input player
Object.values(document.getElementsByClassName('add-player-button')).forEach((element) => {
  element.addEventListener('click', addPlayer);
});

// init players lists
Object.values(document.querySelectorAll(".list span[contenteditable='true'")).forEach((element) => {
  element.addEventListener('input', editPlayerName);
});

// init team names
Object.values(document.querySelectorAll(".team-name span[contenteditable='true'")).forEach((element) => {
  element.addEventListener('input', editTeamName);
});

// init input score
Object.values(document.getElementsByClassName('edit-team-score')).forEach((element) => {
  element.addEventListener('click', editTeamScore);
});

// init reset button
const reset = () => {
  localStorage.clear();
  teamOneTitle.textContent = 'Team 1';
  teamTwoTitle.textContent = 'Team 2';
  teamOneVersusTitle.textContent = 'Team 1';
  teamOneVersusTitle.textContent = 'Team 2';
  frontTeamOneScore.textContent = '0';
  frontTeamTwoScore.textContent = '0';
  teamOneNumber.value = '';
  teamTwoNumber.value = '';

  Object.values(teamOnePlayerList.children).forEach((player) => {
    player.remove();
  });

  Object.values(teamTwoPlayerList.children).forEach((player) => {
    player.remove();
  });

  init();
};

document.getElementById('reset-all').addEventListener('click', reset);