document.addEventListener("DOMContentLoaded", () => {
  const dataTextarea = document.getElementById('textarea');
  const writeSelect = document.getElementById('write');
  const rankingSelect = document.getElementById('ranking');
  document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();

    const data = dataTextarea.value;
    const ranking = rankingSelect.value;
    const type = writeSelect.value;
    const link = '/admin/add-data';

    if (ranking.length && type.length && data.length) {
      fetch(link, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ranking: ranking, type: type, data: data })
      }).then(res => {
        textarea.value = '';
        document.querySelector(`label[for='ranking']`).classList.remove('text-red-600');
        document.querySelector(`label[for='write']`).classList.remove('text-red-600');
        document.querySelector(`label[for='textarea']`).classList.remove('text-red-600');
      });
    } else {
      document.getElementById('error').classList.remove('hidden');
      if (ranking.length === 0) {
        document.querySelector(`label[for='ranking']`).classList.add('text-red-600');
      }
      if (type.length === 0) {
        document.querySelector(`label[for='write']`).classList.add('text-red-600');
      }
      if (data.length === 0) {
        document.querySelector(`label[for='textarea']`).classList.add('text-red-600');
      }
    }
  });

  const synchronization = (event) => {
    event.preventDefault();
    event.target.classList.remove('bg-green-extinction');
    event.target.classList.add('bg-blue-600');
    const game = event.target.dataset.game;
    const link = '/admin/synchronization';
    fetch(link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ game: game })
    }).then(res => {
      const syncResponseDOM = document.getElementById(`${game}-sync-response`);
      syncResponseDOM.textContent = `Status : [${res.status}] ${res.statusText}`;
      if (res.status === 200) {
        syncResponseDOM.classList.remove('text-red-700');
        event.target.classList.remove('bg-blue-600');
        event.target.classList.add('bg-green-600');
        syncResponseDOM.classList.add('text-green-600');
      } else {
        syncResponseDOM.classList.remove('text-green-600');
        event.target.classList.remove('bg-blue-600');
        event.target.classList.add('bg-red-700');
        syncResponseDOM.classList.add('text-red-700');
      }
    });
  };

  Object.values(document.getElementsByClassName('synchro')).forEach((element) => {
    element.addEventListener('click', synchronization);
  });

  Object.values(document.getElementsByClassName('show-data')).forEach((element) => {
    element.addEventListener('click', (event) => {
      const game = event.target.dataset.game;
      const link = `/admin/data?game=${game}`;
      fetch(link, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.text()).then((res) => {
        writeSelect.selectedIndex = 0;
        rankingSelect.selectedIndex = 0;
        dataTextarea.value = '';
        const regex = /\[(.*?)\]/g;
        const row = res.match(regex);
        dataTextarea.value = row[row.length - 1];

      });
    });
  });
});
