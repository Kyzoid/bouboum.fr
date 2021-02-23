import { getRanking } from './get-ranking.js';
import dayjs from 'dayjs';

const game = document.getElementById('title').dataset.game;

const myPikaday = async () => {
  const datepicker = document.getElementById('datepicker');
  const dates = await fetch(`/classements/${game === 'bouboum' ? 'bouboum' : 'aaaah'}/dates`, { headers: { "Content-Type": "application/json; charset=utf-8" } }).then(res => res.json());
  const picker = new Pikaday({
    field: datepicker,
    bound: false,
    container: document.getElementById('calendar-container'),
    toString: (date, format) => {
      return dayjs(date).format('DD/MM/YYYY');
    },
    minDate: new Date('2020-04-30'),
    maxDate: new Date(),
    disableDayFn: (dateParam) => {
      if (dates.find(date => dayjs(date).isSame(dayjs(dateParam)))) {
        return false;
      }
      return true;
    },
    onSelect: (date) => {
      getRanking(date);
      datepicker.textContent = dayjs(date).format('DD/MM/YYYY');
    },
    theme: 'dark-theme',
  });
};

document.addEventListener('DOMContentLoaded', () => {
  myPikaday();
  getRanking();
});
