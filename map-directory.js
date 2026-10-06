/* Derive the website directory from the same place data as daily photo cards. */
(() => {
  const places = window.ITINERARY_PLACES;
  const root = document.getElementById('place-directory');
  if (!Array.isArray(places) || !root) return;
  const make = (tag, text, cls) => {
    const node = document.createElement(tag);
    node.textContent = text;
    if (cls) node.className = cls;
    return node;
  };
  document.getElementById('directory-count').textContent = `${places.length} 個不同地點 · 主線與備選均列入`;
  places.forEach(place => {
    const card = make('article', '', 'place-card');
    card.append(make('span', place.days.map(day => `12/${11 + day}`).join('、'), 'place-type'));
    card.append(make('h3', place.name));
    if (place.note) card.append(make('p', place.note));
    const maps = make('a', 'Google Maps ↗', 'text-button');
    maps.href = place.maps;
    maps.target = '_blank';
    maps.rel = 'noopener noreferrer';
    card.append(maps);
    place.days.forEach(day => {
      const plan = make('a', `12/${11 + day} 註解與照片 ↗`, 'text-button');
      plan.href = `itinerary.html#place-${day}-${place.id}`;
      card.append(plan);
    });
    root.append(card);
  });
})();
