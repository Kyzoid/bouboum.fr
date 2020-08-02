import miniToastr from 'mini-toastr';
miniToastr.init();
miniToastr.setIcon('error', 'img', {src: '/images/error.png'});
miniToastr.setIcon('warn', 'img', {src: '/images/warn.png'});
miniToastr.setIcon('info', 'img', {src: '/images/info.png'});
miniToastr.setIcon('success', 'img', {src: '/images/success.png'});

const handlePollDeletion = (event) => {
    const pollId = event.target.dataset.pollId;

    fetch(`/sondages/${pollId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status !== 204) {
            console.log(response);
            miniToastr.error(`Une erreur est survenue.`);
        } else {
            miniToastr.success(`Le sondage ${pollId} a bien été supprimé.`);
        }
    });
}

Object.values(document.getElementsByClassName('delete-poll')).forEach((deleteButton) => {
    deleteButton.addEventListener('click', handlePollDeletion);
});
