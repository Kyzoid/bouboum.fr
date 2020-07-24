const adjustStr = (input) => {
  const str = input.toString();
  if (str.length === 1) {
    return "0" + str;
  } else {
    return input;
  }
}

if (document.getElementById('clock')) {
  const end = document.getElementById('clock').dataset.endAt;
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  const clock = () => {
    const now = new Date().getTime();
    const remaining = end - now;

    days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    if (remaining > 0) {
      document.getElementById('days').textContent = adjustStr(days);
      document.getElementById('hours').textContent = adjustStr(hours);
      document.getElementById('minutes').textContent = adjustStr(minutes);
      document.getElementById('seconds').textContent = adjustStr(seconds);
    }
  };

  clock();
  setInterval(clock, 1000);
}
