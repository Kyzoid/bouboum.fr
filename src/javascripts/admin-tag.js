const form = document.getElementsByClassName('tags')[0];

const handleSubmit = (event) => {
  event.preventDefault();
  const tagId = document.querySelector('.tags > select').value;
  const mapId = document.getElementById('map-name').dataset.id;

  fetch(`/cartes/${mapId}/tag`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tagId: tagId })
  }).then(res => location.reload());
};

form.addEventListener('submit', handleSubmit);


const tagDeleteButtons = document.getElementsByClassName('delete-tag');

const handleTagDelete = (event) => {
  const tagId = event.target.dataset.tagId;
  const mapId = document.getElementById('map-name').dataset.id;

  fetch(`/cartes/${mapId}/tag/${tagId}`, {
    method: 'DELETE',
  }).then(res => location.reload())
};

Object.values(tagDeleteButtons).forEach(tagDeleteButton => {
  tagDeleteButton.addEventListener('click', handleTagDelete);
});