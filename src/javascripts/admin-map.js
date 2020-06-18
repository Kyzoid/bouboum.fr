const deleteButtons = document.getElementsByClassName('delete-bottom-right');
const infoModalDoc = document.getElementById('info');

const infoModal = (content, type) => {
  infoModalDoc.textContent = content;
  infoModalDoc.classList.remove('border-red-700');
  infoModalDoc.classList.remove('text-red-extinction');
  infoModalDoc.classList.remove('border-green-700');
  infoModalDoc.classList.remove('text-green-extinction');

  if (type === 'error') {
    infoModalDoc.classList.add('border-red-700');
    infoModalDoc.classList.add('text-red-extinction');
  }

  if (type === 'success') {
    infoModalDoc.classList.add('border-green-700');
    infoModalDoc.classList.add('text-green-extinction');
  }

  if (infoModalDoc.classList.contains('hidden')) {
    infoModalDoc.classList.remove('hidden');
  }
}

const handleDelete = (event) => {
  const id = event.target.dataset.id;
  fetch(`/admin/cartes/${id}`, {
    method: 'DELETE'
  }).then((res) => {
    infoModal(`[${res.status}] ${res.statusText}`, (res.status === 204) ? 'success' : 'error');
    if (res.status === 204) {
      event.target.closest('.map').remove();
    }
  });
};

Object.values(deleteButtons).forEach(deleteButton => {
  deleteButton.addEventListener('click', handleDelete);
});