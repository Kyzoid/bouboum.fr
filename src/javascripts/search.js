const mapsDOM = document.querySelectorAll('#maps > .map');

const maps = Object.values(mapsDOM).map((map, index) => {
    return {
        index: index,
        author: map.dataset.author,
        name: map.dataset.name,
        createdAt: map.dataset.createdAt
    };
});

const searchMap = () => {
    const searchValues = document.getElementById('search').value.split(',');
    const mapsToShow = new Array(maps.length).fill(0);

    if (searchValues.length && searchValues[0].length) {
        maps.forEach(map => {
            Object.values(map).forEach(value => {
                searchValues.forEach(searchValue => {
                    const regex = new RegExp(`(${searchValue.toString()})`, 'gi')
                    if (regex.test(value.toString())) {
                        mapsToShow[map.index] = 1;
                    }
                });
            });
        });
        mapsToShow.forEach((value, index) => {
            mapsDOM[index].style.display = value ? 'flex' : 'none';
        });
    } else {
        mapsDOM.forEach(mapDOM => mapDOM.style.display = 'flex');
    }

};

document.getElementById('search').addEventListener('keyup', searchMap);
