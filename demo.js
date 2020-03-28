import render from './index.js';

window.addEventListener('load', () => {
  const timeseriesSvg = document.getElementById('timeseriesSvg');
  const data = [
    // { stamp: new Date(1), value: 50 },
    // { stamp: new Date(2), value: 100 },
    // { stamp: new Date(3), value: 10 },
    // { stamp: new Date(4), value: 100 },
    // { stamp: new Date(5), value: 50 },
  ];

  // Uncomment the above seed values and comment the loop below for static test
  //render(timeseriesSvg, data);

  let stamp = window.performance.now();
  window.requestAnimationFrame(function loop(_stamp) {
    data.push({ stamp: new Date(), value: ~~(1000 / (_stamp - stamp)) });
    stamp = _stamp;

    if (data.length === 60) {
      data.shift();
    }

    render(timeseriesSvg, data);

    // Use this when debugging implementation: slow, but responsive browser
    window.setTimeout(() => requestAnimationFrame(loop), 100);

    // Use this when debugging performance: fast, slows and freezes the browser
    //requestAnimationFrame(loop);
  });
});
