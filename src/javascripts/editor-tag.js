let mapTags = [];
const tags = document.getElementById('tags');
const formElement = document.getElementById('form-tag');
const selectTags = document.getElementById('select-tags');
const tagsToSendElement = document.getElementById('tags-to-send');

const tagHTML = (mapTag) => {
  return `<div data-tag-name=${mapTag.name} data-tag-id="${mapTag.id}" class="mt-1 tag rounded-full flex-wrap bg-extinction mr-1 px-3 py-1 relative">
                <span>${mapTag.name}</span>
                <img class="cursor-pointer ml-1 float-right delete-tag" data-tag-id="${mapTag.id}" src="/images/cross.svg" width="16">
            </div>`;
};

const initTagDeleteButtons = () => {
  const tagDeleteButtons = document.getElementsByClassName('delete-tag');
  Object.values(tagDeleteButtons).forEach(tagDeleteButton => {
    tagDeleteButton.addEventListener('click', handleTagDelete);
  });
};

const renderTags = () => {
  tags.innerHTML = '';
  mapTags.forEach((mapTag) => {
    tags.innerHTML += tagHTML(mapTag);
  });
  tagsToSendElement.value = JSON.stringify(mapTags.map(mapTag => mapTag.id));
  initTagDeleteButtons();
};

const handleSelectTags = () => {
  const tagId = selectTags.value;
  if (mapTags.findIndex(mapTag => mapTag.id === tagId) === -1) {
    let tagName = selectTags.querySelector(`[value="${tagId}"]`).dataset.tagName;
    tagName = tagName.charAt(0).toUpperCase() + tagName.slice(1);
    mapTags.push({ id: tagId, name: tagName });
    renderTags();
  }
  selectTags.value = '';
};

const handleTagDelete = (event) => {
  const tagId = event.target.dataset.tagId;
  
  const tagIndex = mapTags.findIndex(mapTag => mapTag.id === tagId);

  mapTags.splice(tagIndex, 1);
  renderTags();
};

selectTags.addEventListener('change', handleSelectTags);
renderTags();
