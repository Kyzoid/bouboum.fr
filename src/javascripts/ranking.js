import { getBouboumRanking, getAaaahRanking } from './get-ranking.js';
import dayjs from 'dayjs';

const game = document.getElementById('title').dataset.game;
const currentDate = document.getElementById('current-date');

document.addEventListener("DOMContentLoaded", () => {
  if (game === 'bouboum') {
    getBouboumRanking(undefined, true, false, currentDate);
  } else {
    getAaaahRanking(undefined, true, false, currentDate);
  }
  
  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');

  prev.addEventListener('click', () => {
    const currentDate = new Date(document.getElementById('current-date').dataset.date);
    let prevDate = currentDate.setDate(currentDate.getDate() - 1);
    let isPrevButtonAvailable = prevDate > new Date('2020-04-30');

    if (prevDate >= new Date('2020-04-30')) {
      prevDate = dayjs(prevDate).format('YYYY-MM-DD');
      if (game === 'bouboum') {
        getBouboumRanking(prevDate, isPrevButtonAvailable, true);
      } else {
        getAaaahRanking(prevDate, isPrevButtonAvailable, true);
      }
    }
  });

  next.addEventListener('click', () => {
    const currentDate = new Date(document.getElementById('current-date').dataset.date);
    let nextDate = currentDate.setDate(currentDate.getDate() + 1);
    let isNextButtonAvailable = new Date().setHours(0,0,0,0) >= nextDate;

    if (nextDate <= new Date()) {
      nextDate = dayjs(nextDate).format('YYYY-MM-DD');
      if (game === 'bouboum') {
        getBouboumRanking(nextDate, true, isNextButtonAvailable);
      } else {
        getAaaahRanking(nextDate, true, isNextButtonAvailable);
      }
    }
  });
});
