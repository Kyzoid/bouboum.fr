import dayjs from 'dayjs';

const ucFirst = (str) => {
  if (str.length > 0) {
    return str[0].toUpperCase() + str.substring(1);
  } else {
    return str;
  }
}

const game = document.getElementById('title').dataset.game;
const currentDate = document.getElementById('current-date');

export const getBouboumRanking = (date, isPrevButtonAvailable = true, isNextButtonAvailable = true) => {
  const htmlDate = date ? date : dayjs().format('YYYY-MM-DD');
  currentDate.dataset.date = htmlDate;
  const link = `/ranking?date=${htmlDate}&game=${game}`;
  const table = document.getElementById('tbody');

  fetch(link, { headers: { "Content-Type": "application/json; charset=utf-8" } })
    .then(res => res.json())
    .then(response => {
      currentDate.innerText = dayjs(htmlDate).locale('fr').format('DD/MM/YYYY');
      tbody.innerText = '';

      if (isPrevButtonAvailable) {
        document.getElementById('prev').classList.remove('opacity-25');
      } else {
        document.getElementById('prev').classList.add('opacity-25');
      }

      if (isNextButtonAvailable) {
        document.getElementById('next').classList.remove('opacity-25');
      } else {
        document.getElementById('next').classList.add('opacity-25');
      }

      if (response.length > 0) {
        response.forEach((row, i) => {
          const tr = table.insertRow();
          tr.classList.add('shadow-xs');
          tr.classList.add('bg-extinction-dark');
          row = { id: i + 1, player: row.player.name, win: row.win, total: row.total, ratio: row.ratio };

          Object.values(row).forEach((column, i) => {
            const td = tr.insertCell();
            
            if (Object.keys(row)[i] === 'id') {
              td.classList.add('text-blue-extinction');
              td.classList.add('pl-2');
              td.innerText = '#' + column;
            }
            if (Object.keys(row)[i] === 'player') {
              td.classList.add('text-blue-extinction');
              td.innerText = ucFirst(column);
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
        });
      } else {
        const tr = table.insertRow();
        tr.classList.add('shadow-xs');
        tr.classList.add('bg-extinction-dark');
        const td = tr.insertCell();
        td.classList.add('text-center');
        td.innerText = 'Pas de données pour cette date.';
        const attr = document.createAttribute('colspan');
        attr.value = '5';
        td.setAttributeNode(attr);
      }
    })
    .catch(err => {
      console.error(err)
    });

}

export const getAaaahRanking = (date, isPrevButtonAvailable = true, isNextButtonAvailable = true) => {
  const htmlDate = date ? date : dayjs().format('YYYY-MM-DD');
  currentDate.dataset.date = htmlDate;
  const link = `/ranking?date=${htmlDate}&game=${game}`;
  const table = document.getElementById('tbody');

  fetch(link, { headers: { "Content-Type": "application/json; charset=utf-8" } })
    .then(res => res.json())
    .then(response => {
      currentDate.innerText = dayjs(htmlDate).locale('fr').format('DD/MM/YYYY');
      tbody.innerText = '';

      if (isPrevButtonAvailable) {
        document.getElementById('prev').classList.remove('opacity-25');
      } else {
        document.getElementById('prev').classList.add('opacity-25');
      }

      if (isNextButtonAvailable) {
        document.getElementById('next').classList.remove('opacity-25');
      } else {
        document.getElementById('next').classList.add('opacity-25');
      }

      if (response.length > 0) {
        response.forEach((row, i) => {
          const tr = table.insertRow();
          tr.classList.add('shadow-xs');
          tr.classList.add('bg-extinction-dark');
          row = { id: i + 1, player: row.player.name, win: row.win, total: row.total, guiding: row.guiding, guiding_ratio: row.guiding_ratio, kill: row.kill} ;

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
              td.innerText = ucFirst(column);
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
        });
      } else {
        const tr = table.insertRow();
        tr.classList.add('shadow-xs');
        tr.classList.add('bg-extinction-dark');
        const td = tr.insertCell();
        td.classList.add('text-center');
        td.innerText = 'Pas de données pour cette date.';
        const attr = document.createAttribute('colspan');
        attr.value = '100';
        td.setAttributeNode(attr);
      }
    })
    .catch(err => {
      console.error(err)
    });

}