/* One geographic overview per day; all primary stops stay in itinerary order. */
(() => {
  const days = window.ITINERARY_ROUTES;
  if (!Array.isArray(days)) return;
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  };
  const maps = [];
  const init = (container, route) => {
    if (container.dataset.ready || !window.L) return;
    container.dataset.ready = 'true';
    container.textContent = '';
    const map = L.map(container, { scrollWheelZoom: false, tap: false });
    maps.push(map);
    const initialPoints = [...route.stops, ...route.optional].map(s => [s.lat, s.lon]);
    if (route.geometry) initialPoints.push(...route.geometry.coordinates.map(([lon, lat]) => [lat, lon]));
    map.fitBounds(L.latLngBounds(initialPoints), { padding: [30, 30], maxZoom: 15 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const primary = route.stops.map(s => [s.lat, s.lon]);
    const layers = [];
    if (route.geometry) {
      layers.push(L.geoJSON(route.geometry, { style: { color: '#245b8a', weight: 5, opacity: .85 } }).addTo(map));
    } else {
      layers.push(L.polyline(primary, { color: '#245b8a', weight: 4, dashArray: '7 7' }).addTo(map));
    }
    const groups = new Map();
    route.stops.forEach((stop, index) => {
      const key = `${stop.lat.toFixed(5)},${stop.lon.toFixed(5)}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ ...stop, number: index + 1 });
    });
    groups.forEach(group => {
      const stop = group[0];
      const numbers = group.map(s => s.number).join('/');
      const icon = L.divIcon({ className: 'route-number-marker', html: `<span>${numbers}</span>`, iconSize: [numbers.length > 2 ? 42 : 28, 28], iconAnchor: [14, 14] });
      const content = el('div', 'route-popup');
      group.forEach(s => content.append(el('p', '', `${s.number}. ${s.name}`)));
      const marker = L.marker([stop.lat, stop.lon], { icon, title: group.map(s => `${s.number}. ${s.name}`).join(' / ') }).bindPopup(content).addTo(map);
      layers.push(marker);
    });
    route.optional.forEach(stop => {
      const parent = route.stops.find(s => s.id === stop.from) || route.stops[0];
      const icon = L.divIcon({ className: 'route-option-marker', html: '<span>備</span>', iconSize: [28, 28], iconAnchor: [14, 14] });
      const marker = L.marker([stop.lat, stop.lon], { icon, title: `備選：${stop.name}` }).bindPopup(el('p', '', `備選：${stop.name}（不列入主線，條件見行程註解）`)).addTo(map);
      layers.push(marker);
      L.polyline([[parent.lat, parent.lon], [stop.lat, stop.lon]], { color: '#c67d32', weight: 2, dashArray: '4 6' }).addTo(map);
    });
    const bounds = L.featureGroup(layers).getBounds();
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
    const controls = container.closest('.daily-route-overview').querySelector('.route-reset-button');
    controls.addEventListener('click', () => map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 }));
    new ResizeObserver(() => map.invalidateSize()).observe(container);
  };
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      init(entry.target, days[Number(entry.target.dataset.day) - 1]);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '100px' }) : null;
  days.forEach((route, index) => {
    const day = document.querySelector(`#day-${index + 1} .day-gallery`);
    if (!day) return;
    const section = el('section', 'daily-route-overview');
    section.setAttribute('aria-label', `12/${12 + index} 完整路線圖`);
    const top = el('div', 'daily-route-top');
    top.append(el('h5', '', `12/${12 + index} · 當天完整路線圖`));
    const reset = el('button', 'route-reset-button', '看整天路線');
    reset.type = 'button';
    top.append(reset);
    section.append(top);
    const canvas = el('div', 'daily-route-map', '路線地圖準備中…');
    canvas.id = `route-map-${index + 1}`;
    canvas.dataset.day = String(index + 1);
    canvas.setAttribute('aria-label', `12/${12 + index} 的起點、所有停靠點與終點；下方附完整文字順序`);
    section.append(canvas);
    const caption = el('p', 'daily-route-caption', '藍色：當天主線與順序編號 · 橘色「備」：備選支線 · 可縮放、拖曳，點編號看地點。');
    section.append(caption);
    const list = el('ol', 'daily-route-stop-list');
    route.stops.forEach(stop => list.append(el('li', '', stop.name)));
    section.append(list);
    if (route.optional.length) section.append(el('p', 'daily-route-option-list', '備選／擇一：' + route.optional.map(s => s.name).join('、')));
    section.append(el('p', 'daily-route-disclaimer', route.note + ' 底圖為 OpenStreetMap，不是 Google 即時導航；道路線形由 OSRM 規劃，未納入冬季封路、除雪、即時路況及停車限制。虛線只表示順序／支線，不是可直接通行的道路。尚未提供飯店的住宿城市，以站區或溫泉區代表，不是已訂飯店位置。'));
    day.querySelector('h4').after(section);
    if (observer) observer.observe(canvas);
    else init(canvas, route);
  });
  window.tripRouteMaps = maps;
})();
