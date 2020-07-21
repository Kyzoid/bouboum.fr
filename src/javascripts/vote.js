const handleVote = async (event) => {
    event.target.src = '/images/sync.svg';
    event.target.classList.add('rotating');

    const pollId = document.getElementById('poll-title').dataset.pollId;
    const mapId = event.target.dataset.mapId;

    if (event.target.dataset.status === 'false') {
        await fetch(`/sondages/${pollId}/vote/${mapId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ip: '127.0.0.1' })
        }).then(response => {
            event.target.dataset.status = 'true';
            event.target.src = '/images/star-checked.svg';
            event.target.classList.remove('rotating');
        });
    } else {
        await fetch(`/sondages/${pollId}/vote/${mapId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            event.target.dataset.status = 'false';
            event.target.src = '/images/star.svg';
            event.target.classList.remove('rotating');
        });
    }
};

Object.values(document.getElementsByClassName('vote-button')).forEach(voteButton => {
    voteButton.addEventListener('click', handleVote);
});