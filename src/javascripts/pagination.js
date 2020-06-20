const nextBtns = document.getElementsByClassName("next");
const prevBtns = document.getElementsByClassName("prev");
const mapList = document.getElementById("maps");
const pageIndex = document.getElementById("page-index");
const allMaps = document.querySelectorAll('#maps > .map');
const currentPageIndicators = document.getElementsByClassName('current-page');
const mapsPerPage = 23;
let currentPage = 0;

const renderMaps = (currentPage) => {
    Object.values(allMaps).forEach((map, index) => {
        if (index >= currentPage*mapsPerPage && index <= ((currentPage*mapsPerPage)+mapsPerPage) ) {
            map.style.display = 'flex';
        } else {
            map.style.display = 'none';
        }
    });
};

const renderPageIndicator = () => {
    Object.values(currentPageIndicators).forEach(currentPageIndicator => {
        currentPageIndicator.textContent = currentPage + 1;
    });
};

const nextPage = () => {
    if (currentPage <= numberOfPages()) {
        currentPage += 1;
        renderMaps(currentPage);
        renderPageIndicator();
    }
};

const prevPage = () => {
    if (currentPage > 0) {
        currentPage -= 1;
        renderMaps(currentPage);
        renderPageIndicator();
    }
};

const numberOfPages = () => {
    return Math.ceil(allMaps.length / mapsPerPage);
};


Object.values(document.getElementsByClassName('pages-total')).forEach(pagesTotal => {
    pagesTotal.textContent = ` / ${numberOfPages()}`;
});


renderMaps(currentPage);

Object.values(nextBtns).forEach(nextBtn => {
    nextBtn.addEventListener('click', nextPage);
});

Object.values(prevBtns).forEach(prevBtn => {
    prevBtn.addEventListener('click', prevPage);
});