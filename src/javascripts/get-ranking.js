import dayjs from 'dayjs';

const ucFirst = (str) => {
  if (str.length > 0) {
    return str[0].toUpperCase() + str.substring(1);
  } else {
    return str;
  }
}

const game = document.getElementById('title').dataset.game;
const table = document.getElementById('tbody');

const aaaahTableRow = (row, i) => {
  const tr = table.insertRow();
  tr.classList.add('shadow-xs');
  tr.classList.add('bg-extinction-dark');
  row = { id: i + 1, player: row.player.name, win: row.win, total: row.total, guiding: row.guiding, guiding_ratio: row.guiding_ratio, kill: row.kill, playerId: row.player.id } ;

  Object.values(row).forEach((column, i) => {
    let td;
    if (Object.keys(row)[i] !== 'guiding_ratio') {
      td = tr.insertCell();
    }
    
    if (Object.keys(row)[i] === 'id') {
      td.classList.add('text-blue-extinction');
      td.classList.add('pl-2');
      td.innerText = '#' + column;
    }
    if (Object.keys(row)[i] === 'player') {
      td.classList.add('text-blue-extinction');
      const anchor = document.createElement('a');
      anchor.href = `/profil/${row.playerId}`;
      anchor.innerText = ucFirst(column);
      anchor.classList.add('hover:underline');
      td.appendChild(anchor);
    }
    if (Object.keys(row)[i] === 'win') {
      td.classList.add('text-center');
      td.classList.add('text-yellow-extinction');
      const percent = ((column / Object.values(row)[i + 1]) * 100).toFixed(2);
      const percentElement = document.createElement('SPAN');
      percentElement.innerText = ` (${percent}%)`;
      percentElement.classList.add('text-xs');
      td.innerText = `${column}`;
      td.appendChild(percentElement);
    }
    if (Object.keys(row)[i] === 'total') {
      td.classList.add('text-center');
      td.innerText = column;
    }
    if (Object.keys(row)[i] === 'guiding') {
      td.classList.add('text-center');
      td.classList.add('text-green-extinction');
      const percent = Object.values(row)[i + 1] / 100;
      const percentElement = document.createElement('SPAN');
      percentElement.innerText = ` (${percent}%)`;
      percentElement.classList.add('text-xs');
      td.innerText = `${column}`;
      td.appendChild(percentElement);
    }
    if (Object.keys(row)[i] === 'kill') {
      td.classList.add('text-center');
      td.classList.add('text-red-extinction')
      td.innerText = column;
    }
  });
};

const bouboumTableRow = (row, i) => {
  const tr = table.insertRow();
  tr.classList.add('shadow-xs');
  tr.classList.add('bg-extinction-dark');
  row = { id: i + 1, player: row.player.name, win: row.win, total: row.total, ratio: row.ratio, playerId: row.player.id };

  Object.values(row).forEach((column, i) => {
    const td = tr.insertCell();
    
    if (Object.keys(row)[i] === 'id') {
      td.classList.add('text-blue-extinction');
      td.classList.add('pl-2');
      td.innerText = '#' + column;
    }
    if (Object.keys(row)[i] === 'player') {
      td.classList.add('text-blue-extinction');
      const anchor = document.createElement('a');
      anchor.href = `/profil/${row.playerId}`;
      anchor.innerText = ucFirst(column);
      anchor.classList.add('hover:underline');
      td.appendChild(anchor);
    }
    if (Object.keys(row)[i] === 'win') {
      td.classList.add('text-center');
      td.classList.add('text-yellow-extinction');
      const percent = ((column / Object.values(row)[i + 1]) * 100).toFixed(2);
      const percentElement = document.createElement('SPAN');
      percentElement.innerText = ` (${percent}%)`;
      percentElement.classList.add('text-xs');
      td.innerText = `${column}`;
      td.appendChild(percentElement);
    }
    if (Object.keys(row)[i] === 'total') {
      td.classList.add('text-center');
      td.innerText = column;
    }
    if (Object.keys(row)[i] === 'ratio') {
      td.classList.add('text-center');
      td.classList.add('text-red-extinction');
      td.innerText = column / 100;
    }
  });
};

export const getRanking = (date) => {
  const htmlDate = date ? dayjs(date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
  const link = `/classements?date=${htmlDate}&game=${game}`;

  fetch(link, { headers: { "Content-Type": "application/json; charset=utf-8" } })
    .then(res => res.json())
    .then(response => {
      tbody.innerText = '';

      if (response.length > 0) {
        response.forEach(game === 'bouboum' ? bouboumTableRow : aaaahTableRow);
      } else {
        const tr = table.insertRow();
        tr.classList.add('shadow-xs');
        tr.classList.add('bg-extinction-dark');
        const td = tr.insertCell();
        td.classList.add('text-center');
        td.innerText = 'Pas de données pour cette date.';
        const attr = document.createAttribute('colspan');
        attr.value = game === 'bouboum' ? '5' : '6';
        td.setAttributeNode(attr);
      }
    })
    .catch(err => {
      console.error(err)
    });
}