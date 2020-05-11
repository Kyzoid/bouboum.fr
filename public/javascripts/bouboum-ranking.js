const ucFirst = (str) => {
  if (str.length > 0) {
    return str[0].toUpperCase() + str.substring(1);
  } else {
    return str;
  }
}

const currentDate = document.getElementById('current-date');

const getRanking = (date, isPrevButtonAvailable = true, isNextButtonAvailable = true) => {
  const htmlDate = date ? date : dayjs().format('YYYY-MM-DD');
  currentDate.dataset.date = htmlDate;
  const link = `/bouboum-ranking?date=${htmlDate}`;
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
          row = { id: i + 1, ...row };

          Object.values(row).forEach((column, i) => {
            const td = tr.insertCell();
            if (Object.keys(row)[i] === 'id') {
              td.classList.add('text-blue-extinction');
              td.classList.add('pl-2');
              td.innerText = '#' + column;
            }
            if (Object.keys(row)[i] === 'username') {
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

document.addEventListener("DOMContentLoaded", function () {
  getRanking(undefined, true, false);

  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');

  prev.addEventListener('click', () => {
    const currentDate = new Date(document.getElementById('current-date').dataset.date);
    let prevDate = currentDate.setDate(currentDate.getDate() - 1);
    let isPrevButtonAvailable = prevDate > new Date('2020-04-30');

    if (prevDate >= new Date('2020-04-30')) {
      prevDate = dayjs(prevDate).format('YYYY-MM-DD');
      getRanking(prevDate, isPrevButtonAvailable, true);
    }
  });

  next.addEventListener('click', () => {
    const currentDate = new Date(document.getElementById('current-date').dataset.date);
    let nextDate = currentDate.setDate(currentDate.getDate() + 1);
    let isNextButtonAvailable = new Date().setHours(0,0,0,0) >= nextDate;

    if (nextDate <= new Date()) {
      nextDate = dayjs(nextDate).format('YYYY-MM-DD');
      getRanking(nextDate, true, isNextButtonAvailable);
    }
  });
});
