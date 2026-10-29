/* Independent design preview. Shared public source data; no bookings or itinerary mutations. */
(() => {
  'use strict';
  const places = window.ITINERARY_PLACES || [];
  const route = window.ITINERARY_ROUTES?.find(d => d.day === 4);
  const byId = id => places.find(p => p.id === id);
  const $ = selector => document.querySelector(selector);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
  const link = (label, href, cls) => { const a = el('a', cls, label); a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rows = [
    {key:'canal',ids:['canal'],time:'06:30',title:'小樽運河，晨光裡散步',desc:'先退房寄存、外帶早餐，讓早晨留給運河。',kind:'planned',tag:'已排入',note:'OMO5提早退房操作待確認；當天寄存行李，離開小樽前取回。'},
    {key:'chiikawa',ids:['chiikawa-otaru'],time:'09:30',title:'吉伊卡哇・小樽限定',desc:'もぐもぐ本舗小樽店，預留45–60分鐘。',kind:'planned',tag:'已排入',note:'目前營業參考09:30–17:30；新品日可能需整理券，入場與商品庫存不保證。'},
    {key:'kitty',ids:['kitty'],time:'10:30–11:00',title:'找一隻小樽 Hello Kitty',desc:'逛1F商品店，找照片中的和服Kitty。',kind:'planned',tag:'已排入',owner:'Yabi想去',open:true,alert:'限定款庫存未確認；這次不排2F咖啡廳用餐。'},
    {key:'sweets',ids:['letao','kitakaro'],time:'11:00–11:20',title:'LeTAO／北菓樓，甜一點就好',desc:'擇重點短逛，不把兩間都當作必須完成。',kind:'planned',tag:'彈性短逛',note:'若前段排隊，優先縮短甜點停留，保留12:00離開小樽的目標。'},
    {key:'departure',ids:[],stop:'otaru',time:'11:30–12:00',title:'簡短午餐，取行李往札幌',desc:'回OMO5拿行李，目標12:00前離開小樽。',kind:'planned',tag:'出發目標',note:'取行李、停車與冬季交通都須預留時間；午後跨札幌往返，里程與車程仍待逐段核對。'},
    {key:'send',ids:['memento'],time:'12:45–13:15',title:'把旅行照片，做成冰箱貼',desc:'白色戀人公園・都鐸屋1F，先送件再離開。',kind:'planned',tag:'已排・未下單',owner:'Yabi想去',alert:'交付可能等1–4小時。先確認當日能否製作、幾點可取。'},
    {key:'shrine',ids:['kiyota'],time:'14:00–14:30',title:'清田稻荷神社',desc:'貓咪御守、御朱印，以及冬天的小小參拜。',kind:'planned',tag:'已排入',owner:'Yabi想去',alert:'15:00前完成；15:00後不可過鳥居登階。'},
    {key:'checkin',ids:[],stop:'sapporo',time:'15:30–16:00',title:'PINN入住，先放好行李',desc:'今晚住PINN-N4E2Ⅱ；飯店15:00起可入住。',kind:'booked',tag:'住宿已預訂',note:'停車與提早寄存未確認。若店家要求較早取件，可依實際情況調整入住與取件先後，不改住宿訂單。'},
    {key:'collect',ids:['memento'],time:'16:45–17:30',title:'回到公園，帶走自己的紀念',desc:'依店家指定交付時間，返回取冰箱貼。',kind:'planned',tag:'回店取件',alert:'18:00閉店。13:15送件若等4小時約17:15可取，仍非保證。'},
    {key:'parco',ids:['chiikawa-sapporo'],time:'18:15–19:15',title:'札幌PARCO，再逛吉伊卡哇',desc:'本館B2Fちいかわらんど，已由16:00順延。',kind:'planned',tag:'已排入',note:'營業參考10:00–20:00；12月營業、入場整理券與庫存出發前確認。'},
    {key:'dinner',ids:[],time:'晚間',title:'今晚吃什麼，留點選擇',desc:'根室花丸、はちきょう、おまる商店擇一候選，皆未訂位。',kind:'optional',tag:'餐廳待選',note:'喫茶流れ星另列20:30–21:15夜咖啡建議。晚餐或取件延誤、疲勞就略過，不把狸小路／TNOC等備選全部加進主線。'}
  ];
  const extras = [
    ['aquarium','sight','備案','optional'],['nagare','food','夜咖啡建議','proposed'],['butter','food','未排時段','optional'],['shinko','food','外帶候選','optional'],['okuno','shopping','昭和小物','optional'],['omaru','food','晚餐未訂位','optional'],['hanamaru','food','晚餐候選','optional'],['hachikyo','food','晚餐候選','optional'],['glass','sight','有餘裕再去','optional'],['redbrick','sight','非固定停留','optional'],['odori','sight','非固定停留','optional'],['tanuki','shopping','有餘裕再逛','optional'],['tnoc','shopping','有餘裕再逛','optional'],['moiwa','sight','時間天候允許','optional']
  ].filter(([id]) => byId(id));
  const hero = byId('canal')?.photos[0];
  if (hero) { $('#hero-image').src = hero.url; $('#hero-image').referrerPolicy = 'no-referrer'; $('#hero-source').href = hero.source; }
  let map, primaryLayers, optionalLayers, selected = 'kitty', showExtras = false, view = 'plan', filter = 'all';
  const markerGroups = [];
  function badge(text, cls) { return el('span', `badge ${cls}`, text); }
  function photoGallery(p, container) {
    if (!p) return;
    container.append(el('span', 'gallery-label', `${p.name} · 3張參考照片`));
    const track = el('div', 'photo-track'); track.tabIndex = 0; track.setAttribute('aria-label', `${p.name}照片，可左右滑動`);
    p.photos.forEach((photo, i) => {
      const fig = el('figure'); const a = link('', photo.source); a.setAttribute('aria-label', `${p.name}照片${i + 1}，開啟來源`);
      const img = el('img'); img.src = photo.url; img.alt = `${p.name}參考照片${i + 1}，非出遊當日現況`; img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer'; img.width = 600; img.height = 375;
      img.addEventListener('error', () => { img.hidden = true; a.append(el('div', 'photo-missing', '圖片暫時無法載入，點此查看來源 ↗')); }, {once:true});
      a.append(img); fig.append(a); const caption = el('figcaption', '', `${i + 1}/3 · ${photo.title} · `); caption.append(link(new URL(photo.source).hostname, photo.source)); fig.append(caption); track.append(fig);
    });
    container.append(track, el('p', 'photo-help', '← 左右滑動看三張照片 · 照片權利歸原作者，非當日雪況或現貨保證'));
  }
  function detailsFor(ids, custom, open = true) {
    const details = el('details', 'stop-details'); details.open = open;
    const summary = el('summary', '', ids.length ? '詳細註記與照片' : '展開行程註記'); const body = el('div', 'detail-content');
    if (custom) body.append(el('p', 'place-description', custom));
    ids.forEach(id => { const p = byId(id); if (!p) return; body.append(el('p', 'place-description', p.note)); photoGallery(p, body); const links = el('div', 'detail-links'); links.append(link('Google Maps ↗', p.maps), link('原版完整註記 ↗', `itinerary.html#place-4-${id}`)); body.append(links); });
    details.append(summary, body); return details;
  }
  rows.forEach((row, i) => {
    const article = el('article', `timeline-card${row.key === selected ? ' selected' : ''}`); article.id = `stop-${row.key}`; article.dataset.stop = row.key;
    article.append(el('span', 'stop-number', String(i + 1).padStart(2,'0')));
    const card = el('div', 'stop-card'), main = el('div', 'stop-main'), meta = el('div', 'stop-meta');
    const time = el('time', 'stop-time', row.time); meta.append(time); const badges = el('div', 'badges'); badges.append(badge(row.tag, row.kind)); if (row.owner) badges.append(badge(row.owner, 'owner')); meta.append(badges);
    const title = el('div', 'stop-title'); const h = el('h3'); const focus = el('button', 'focus-stop', row.title); focus.type = 'button'; focus.addEventListener('click', () => focusStop(row.key)); h.append(focus); title.append(h);
    const target = byId(row.ids[0]); if (target) title.append(link('導航 ↗', target.maps, 'navigate'));
    main.append(meta, title, el('p', 'stop-desc', row.desc)); if (row.alert) main.append(el('p', 'stop-alert', `注意｜${row.alert}`));
    card.append(main, detailsFor(row.ids, row.note, row.open)); article.append(card); $('#timeline').append(article);
    article.querySelector('details').addEventListener('toggle', () => { if (article.querySelector('details').open) focusStop(row.key, false); });
  });
  function renderExtras() {
    const query = $('#extra-search').value.trim().toLocaleLowerCase(); let count = 0; $('#extras-grid').replaceChildren();
    extras.forEach(([id,category,tag,kind]) => {
      const p = byId(id); if ((filter !== 'all' && category !== filter) || (query && !`${p.name} ${p.note}`.toLocaleLowerCase().includes(query))) return; count++;
      const card = el('article', 'extra-card'); const main = el('div', 'stop-main'); main.append(badge(tag, kind)); const h = el('h3'); const focus = el('button', 'focus-stop', p.name); focus.type = 'button'; focus.addEventListener('click', () => focusExtra(id)); h.append(focus); main.append(h, el('p', 'stop-desc', p.note), link('開啟導航 ↗', p.maps, 'text-link')); card.append(main, detailsFor([id])); $('#extras-grid').append(card);
    });
    $('#extra-count').textContent = `${count} 個地點 · 不是必達行程`; $('#empty-extras').hidden = count !== 0;
  }
  function setView(next) {
    view = next; document.body.dataset.view = next;
    document.querySelectorAll('[data-view]').forEach(b => { if (b === document.body) return; if (b.dataset.view === next) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); });
    document.querySelectorAll('.panel').forEach(p => { p.hidden = !p.classList.contains(`panel-${next}`); });
    if (next === 'extras') { renderExtras(); if (!showExtras) toggleExtras(); }
    requestAnimationFrame(() => { map?.invalidateSize(); });
  }
  function selectCard(key) {
    selected = key; document.querySelectorAll('.timeline-card').forEach(c => c.classList.toggle('selected', c.dataset.stop === key));
    markerGroups.forEach(({marker,keys}) => marker.getElement()?.classList.toggle('active', keys.includes(key)));
    const row = rows.find(r => r.key === key); if (!row) return;
    const root = $('#map-selection'); root.replaceChildren(el('span','selection-kicker', `${row.time} · ${row.tag}`), el('strong','',row.title), el('p','',row.alert || row.desc));
    const button = el('button','', '查看行程卡片 ↑'); button.type = 'button'; button.addEventListener('click', () => { setView('plan'); scrollCard(key); }); root.append(button);
  }
  function scrollCard(key) { document.getElementById(`stop-${key}`)?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'}); }
  function focusStop(key, move = true) {
    selectCard(key); if (!move || !map) return;
    const group = markerGroups.find(g => g.keys.includes(key)); if (group) { map.setView(group.marker.getLatLng(), Math.max(map.getZoom(), 13), {animate:!reduced}); group.marker.openPopup(); }
  }
  function focusExtra(id) {
    const item = route?.optional.find(s => s.id === id), p = byId(id); if (!item || !map) return;
    if (!showExtras) toggleExtras(); const root = $('#map-selection'); root.replaceChildren(el('span','selection-kicker','備選 · 非固定主線'),el('strong','',p.name),el('p','',p.note));
    if (innerWidth <= 700) setView('map'); requestAnimationFrame(() => { map.invalidateSize(); map.setView([item.lat,item.lon],13,{animate:!reduced}); });
  }
  function fitMap() { if (!map || !route) return; const pts = route.stops.concat(showExtras ? route.optional : []).map(s => [s.lat,s.lon]); map.fitBounds(pts,{padding:[30,30],maxZoom:14,animate:!reduced}); }
  function toggleExtras() { showExtras = !showExtras; $('#toggle-extras').setAttribute('aria-pressed',String(showExtras)); $('#toggle-extras').lastChild.textContent = showExtras ? '隱藏備選' : '顯示備選'; if (map && optionalLayers) showExtras ? optionalLayers.addTo(map) : optionalLayers.removeFrom(map); }
  function initMap() {
    if (!window.L || !route) { $('#day-map').replaceChildren(el('p','map-fallback','互動地圖暫時無法載入，請用下方Google Maps連結。')); return; }
    $('#day-map').replaceChildren(); map = L.map('day-map',{scrollWheelZoom:false});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
    primaryLayers = L.layerGroup().addTo(map); optionalLayers = L.layerGroup();
    L.polyline(route.stops.map(s=>[s.lat,s.lon]),{color:'#416a52',weight:3,opacity:.8,dashArray:'5 7'}).addTo(primaryLayers);
    const grouped = new Map();
    rows.forEach((r,i) => {
      const points = r.ids.map(id=>route.stops.find(s=>s.id===id)).filter(Boolean); if (r.stop) { const p = route.stops.find(s=>s.id===r.stop); if(p) points.push(p); }
      points.forEach(p=>{ const key=`${p.lat.toFixed(5)},${p.lon.toFixed(5)}`; if(!grouped.has(key)) grouped.set(key,{p,rows:[]}); grouped.get(key).rows.push({row:r,n:i+1}); });
    });
    grouped.forEach(({p,rows:rs})=>{
      const numbers=[...new Set(rs.map(r=>r.n))].join('/'), keys=rs.map(r=>r.row.key);
      const icon=L.divIcon({className:`route-pin${rs.length>1?' combined':''}${keys.includes(selected)?' active':''}`,html:`<span>${numbers}</span>`,iconSize:[rs.length>1?36:26,26],iconAnchor:[13,13]});
      const marker=L.marker([p.lat,p.lon],{icon,title:rs.map(r=>`${r.n}. ${r.row.title}`).join(' / '),keyboard:true}).addTo(primaryLayers);
      const popup=el('div'); rs.forEach(r=>popup.append(el('p','',`${r.n}. ${r.row.time} ${r.row.title}`))); marker.bindPopup(popup);
      marker.on('click',()=>{selectCard(keys[0]);if(view==='map'&&innerWidth<=700)return;if(view!=='plan')setView('plan');scrollCard(keys[0]);}); markerGroups.push({marker,keys});
    });
    route.optional.forEach(p=>{ const icon=L.divIcon({className:'route-pin extra-pin',html:'<span>備</span>',iconSize:[24,24],iconAnchor:[12,12]});const m=L.marker([p.lat,p.lon],{icon,title:`備選：${p.name}`}).addTo(optionalLayers);m.bindPopup(el('div','',`備選：${p.name}，非固定停留`));m.on('click',()=>{const place=byId(p.id);if(place){$('#map-selection').replaceChildren(el('span','selection-kicker','備選 · 非固定主線'),el('strong','',place.name),el('p','',place.note));}}); });
    fitMap(); selectCard(selected); new ResizeObserver(()=>map.invalidateSize()).observe($('#day-map'));
    window.previewMap=map;
  }
  document.querySelectorAll('button[data-view]').forEach(b=>b.addEventListener('click',()=>{setView(b.dataset.view);window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});}));
  $('#show-info').addEventListener('click',()=>{setView('info');$('#info-heading').scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});});
  $('#fit-map').addEventListener('click',fitMap); $('#toggle-extras').addEventListener('click',toggleExtras); $('#extra-search').addEventListener('input',renderExtras);
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});renderExtras();}));
  renderExtras(); initMap();
  requestAnimationFrame(() => { const dates=$('.dates'), active=$('.dates .active'); if(active&&dates) dates.scrollLeft += active.getBoundingClientRect().left-dates.getBoundingClientRect().left-(dates.clientWidth-active.clientWidth)/2; });
})();
