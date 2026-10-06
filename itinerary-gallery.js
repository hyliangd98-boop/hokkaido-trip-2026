/* The main itinerary remains readable without JavaScript. Optional stops stay optional. */
(() => {
  const places = window.ITINERARY_PLACES;
  if (!Array.isArray(places)) return;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const link = (label, href, className) => {
    const node = make('a', className, label);
    node.href = href;
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
    return node;
  };
  const route = stops => 'https://www.google.com/maps/dir/' + stops.map(encodeURIComponent).join('/');
  const additionalRoutes = {
    2: [['取車前｜函館步行停靠點', ['函館朝市', '金森赤レンガ倉庫', 'アンジェリック ヴォヤージュ', '旧函館区公会堂', '函館市旧イギリス領事館', '滋養軒']]],
    3: [
      ['前段｜室蘭 → 洞爺湖 → 真狩', ['ドーミーイン東室蘭', '洞爺湖温泉', 'レークヒルファーム', 'サイロ展望台', '真狩村']],
      ['後段｜真狩 → 二世谷 → 雪圈滑坡 → 小樽', ['真狩村', '道の駅ニセコビュープラザ', '倶知安駅', 'Hanazono 308', '余市駅', '小樽運河']]
    ]
  };
  const nav = make('nav', 'day-jump-nav');
  nav.setAttribute('aria-label', '跳到行程日期');
  document.querySelectorAll('.day-card').forEach((day, index) => {
    const number = index + 1;
    day.id = `day-${number}`;
    const jump = make('a', '', `12/${11 + number}`);
    jump.href = `#day-${number}`;
    nav.append(jump);
    const stops = places.filter(place => place.days.includes(number));
    const section = make('section', 'day-gallery');
    const heading = make('h4', '', '整天路線圖・Google Maps・景點照片');
    heading.id = `gallery-heading-${number}`;
    section.setAttribute('aria-labelledby', heading.id);
    section.append(heading);
    const routes = make('div', 'gallery-routes');
    const existing = day.querySelector('.day-side a[href*="google.com/maps/dir"]');
    if (existing) routes.append(link(`開啟當天${number === 2 ? '取車後' : ''}路線 ↗`, existing.href, 'gallery-route-link'));
    (additionalRoutes[number] || []).forEach(([label, stops]) => routes.append(link(`${label} ↗`, route(stops), 'gallery-route-link')));
    section.append(routes);
    section.append(make('p', 'gallery-map-note', '地圖是停靠點順序參考，Google 可能自動改道或省略途經點；冬季封路、道道 66 號山麓路線與聖誕樹交通限制，請依上方註解及當日管制確認。備選餐廳／活動未全部加入主路線。'));
    const details = make('details', 'gallery-details');
    details.open = true;
    details.append(make('summary', '', `${stops.length} 個地點 · 每個地點 3 張參考照片（可收合）`));
    const grid = make('div', 'place-gallery-grid');
    stops.forEach(place => {
      const card = make('article', 'place-gallery-card');
      card.id = `place-${number}-${place.id}`;
      const top = make('div', 'place-gallery-top');
      top.append(make('h5', '', place.name));
      top.append(link('Google Maps ↗', place.maps, 'place-map-link'));
      card.append(top);
      if (place.note) card.append(make('p', 'place-gallery-note', place.note));
      const photos = make('div', 'place-photo-row');
      place.photos.forEach((photo, index) => {
        const figure = make('figure', 'place-photo');
        const imageLink = link('', photo.source, 'place-image-link');
        imageLink.setAttribute('aria-label', `${place.name}：照片 ${index + 1}，開啟圖片來源`);
        const img = make('img');
        img.alt = `${place.name}參考照片 ${index + 1}（非出遊當日雪況）`;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = 480;
        img.height = 320;
        img.referrerPolicy = 'no-referrer';
        img.addEventListener('error', () => {
          imageLink.classList.add('image-unavailable');
          img.hidden = true;
          imageLink.append(make('span', '', '圖片暫時無法載入\n點此查看原始來源 ↗'));
        }, { once: true });
        img.src = photo.url;
        imageLink.append(img);
        figure.append(imageLink);
        const caption = make('figcaption');
        const source = link(`${index + 1} · ${new URL(photo.source).hostname.replace(/^www\./, '')}`, photo.source);
        source.title = photo.title;
        caption.append(source);
        figure.append(caption);
        photos.append(figure);
      });
      card.append(photos);
      grid.append(card);
    });
    details.append(grid);
    section.append(details);
    section.append(make('p', 'gallery-credit-note', '照片由外部來源載入，點圖片或來源可查看原文；圖片權利歸原作者。照片拍攝季節與年份可能不同，不代表 2026 年 12 月實際積雪、活動開放或當天菜單。'));
    day.append(section);
  });
  document.querySelector('.daily-section > .section-heading')?.after(nav);
})();
