// js/script.js
const API_KEY = '0gASAsx8IDVvPJv66yMT8VUkCyoZ0vOLGlKH9khv';
const today = new Date().toISOString().split('T')[0];

document.addEventListener('DOMContentLoaded', () => {
  const startInput  = document.getElementById('startDate');
  const endInput    = document.getElementById('endDate');
  const fetchButton = document.getElementById('fetch-button');
  const gallery     = document.getElementById('gallery');
  const factEl      = document.getElementById('random-fact');

  // Random Space Facts
  const facts = [
    'Moon footprints will last for millions of years.',
    'A day on Venus is longer than its year.',
    'Neutron stars can spin 600 times per second.',
    'More stars in the universe than grains of sand on Earth.',
    'Jupiter’s Great Red Spot is a storm bigger than Earth.'
  ];
  factEl.textContent = '💡 Did you know? ' + facts[Math.floor(Math.random() * facts.length)];

  // Initialize date‐pickers (from dateRange.js)
  setupDateInputs(startInput, endInput);

  fetchButton.addEventListener('click', () => {
    // Calculate your 9-day window
    const sd = new Date(startInput.value);
    const ed = new Date(sd);
    ed.setDate(sd.getDate() + 8);
    // never go past today
    const endDate = ed > new Date(today)
      ? today
      : ed.toISOString().split('T')[0];

    console.log('Fetching APOD from', startInput.value, 'to', endDate);

    // show loading
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🔄</div>
        <p>Loading space photos…</p>
      </div>`;

    const url = `https://api.nasa.gov/planetary/apod`
              + `?api_key=${API_KEY}`
              + `&start_date=${startInput.value}`
              + `&end_date=${endDate}`;

    fetch(url)
      .then(res => {
        console.log('Status:', res.status);
        return res.json();
      })
      .then(data => {
        // if you get back an object (error), throw it so the catch block shows it
        if (!Array.isArray(data)) {
          throw new Error(data.error?.message || 'Unexpected response');
        }

        gallery.innerHTML = '';  // clear loading

        data.forEach(item => {
          const card = document.createElement('div');
          card.className = 'gallery-item';

          if (item.media_type === 'image') {
            const img = document.createElement('img');
            img.src = item.url;
            img.alt = item.title;
            card.appendChild(img);
          } else {
            const vid = document.createElement('iframe');
            vid.src = item.url;
            vid.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            card.appendChild(vid);
          }

          const title = document.createElement('h3');
          title.textContent = item.title;
          const date  = document.createElement('p');
          date.textContent  = item.date;
          card.appendChild(title);
          card.appendChild(date);

          gallery.appendChild(card);
        });
      })
      .catch(err => {
        console.error('Fetch/display error:', err);
        gallery.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
      });
  });
});
