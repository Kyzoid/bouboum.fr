document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();

    const dataTextarea = document.getElementById('textarea');
    const data = dataTextarea.value;

    const rankingSelect = document.getElementById('ranking');
    const ranking = rankingSelect.value;

    const writeSelect = document.getElementById('write');
    const type = writeSelect.value;

    const link = '/add-data';
    const table = document.getElementById('tbody');

    if (ranking.length && type.length && data.length) {
      fetch(link, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ranking: ranking, type: type, data: data})
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
});