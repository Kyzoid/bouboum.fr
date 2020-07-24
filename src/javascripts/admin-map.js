import miniToastr from 'mini-toastr';
miniToastr.init();
miniToastr.setIcon('error', 'img', {src: '/images/error.png'});
miniToastr.setIcon('warn', 'img', {src: '/images/warn.png'});
miniToastr.setIcon('info', 'img', {src: '/images/info.png'});
miniToastr.setIcon('success', 'img', {src: '/images/success.png'});

const deleteButtons = document.getElementsByClassName('delete-bottom-right');

const handleDelete = (event) => {
  const id = event.target.dataset.id;
  fetch(`/cartes/${id}`, {
    method: 'DELETE'
  }).then((res) => {
    if (res.status === 204) {
      miniToastr.success(`[${res.status}] ${res.statusText}`);
      event.target.closest('.map').remove();
    } else {
      miniToastr.error(`[${res.status}] ${res.statusText}`)
    }
  });
};

Object.values(deleteButtons).forEach(deleteButton => {
  deleteButton.addEventListener('click', handleDelete);
});