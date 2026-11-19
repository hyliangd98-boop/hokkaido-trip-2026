/* Progressive enhancement: HTML remains the authoritative itinerary and no-JS fallback.
   Presentation only: never changes reservations, external Maps lists or private notes. */
(() => {
  'use strict';
  const sourceDays = [...document.querySelectorAll('.day-card')];
  if (sourceDays.length !== 8 || !window.JOURNEY_SHELL || !window.ITINERARY_PLACES || !window.ITINERARY_ROUTES) return;
  const originalMain = document.querySelector('main');
  const originals = [...originalMain.children].filter(s => !s.classList.contains('daily-section') && !s.classList.contains('roadtrip-hero'));
  const days = sourceDays.map((s, i) => ({
    day:i+1, title:s.querySelector('.day-header h3').textContent,
    date:s.querySelector('.day-header p').textContent,
    drive:s.querySelector('.drive-stat').textContent,
    entries:[...s.querySelectorAll('.day-plan li')].map(n=>({time:n.querySelector('time').textContent,html:n.querySelector('span').innerHTML})),
    side:s.querySelector('.day-side').innerHTML,
    links:[...s.querySelectorAll('.day-side a[href*="google.com/maps/dir"]')].map(a=>({text:a.textContent,href:a.href}))
  }));
  const configs = [
    {
      "title": "初見函館，入夜之後。",
      "city": "函館",
      "stay": "東橫 INN · 已預訂",
      "hero": "hakodate",
      "warning": "先放行李再出門 · 冬季纜車末班與風況當晚再確認",
      "rows": [
        [
          "抵達函館",
          "airport"
        ],
        [
          "機場到函館站",
          "hotel"
        ],
        [
          "入住，先放好行李",
          "hotel"
        ],
        [
          "搭市電去十字街",
          "jjuji"
        ],
        [
          "小丑漢堡，今晚的第一口",
          "lucky"
        ],
        [
          "走向函館山纜車",
          "ropeway"
        ],
        [
          "函館山，等城市亮起",
          "hakodate"
        ],
        [
          "回飯店，好好休息",
          "hotel"
        ]
      ]
    },
    {
      "title": "港邊散步，往北出發。",
      "city": "函館 → 東室蘭",
      "stay": "Dormy Inn · 訂單待補",
      "hero": "kanemori",
      "warning": "10:00前退房 · 15:00機場取車固定 · 夜鳴拉麵21:30–23:00，不為宵夜趕路",
      "rows": [
        [
          "整理行李，留胃給早餐",
          "hotel"
        ],
        [
          "世壱屋的海鮮丼",
          "yoichiya"
        ],
        [
          "退房寄存，走進朝市",
          "market"
        ],
        [
          "金森倉庫與港邊",
          "kanemori"
        ],
        [
          "現做可麗餅，買了就吃",
          "angelique"
        ],
        [
          "元町洋館與菠蘿麵包",
          "hall",
          "consulate",
          "melonpan"
        ],
        [
          "滋養軒，函館鹽味拉麵",
          "jiyoken"
        ],
        [
          "搭車去Times機場店",
          "times"
        ],
        [
          "15:00，正式取車",
          "times"
        ],
        [
          "回飯店取行李",
          "hotel"
        ],
        [
          "沼の家，糰子小點心",
          "numanoya"
        ],
        [
          "沿途晚餐與休息"
        ],
        [
          "Dormy Inn 東室蘭入住",
          "muroran"
        ],
        [
          "夜鳴拉麵，暖暖收尾",
          "muroran"
        ]
      ]
    },
    {
      "title": "湖的藍，羊蹄山的白。",
      "city": "東室蘭 → 洞爺湖 → 小樽",
      "stay": "OMO5 小樽 · 已預訂",
      "hero": "toya",
      "warning": "06:30出發 · 道道66只走山麓段 · HANAZONO當天登記，積雪與空位不保證",
      "rows": [
        [
          "從東室蘭出發",
          "muroran"
        ],
        [
          "洞爺湖，晨光與湖面",
          "toya"
        ],
        [
          "Lake Hill Farm，冬日冰淇淋",
          "lakehill"
        ],
        [
          "Silo展望台，眺望中島",
          "silo"
        ],
        [
          "真狩，羊蹄山麓的公路",
          "makkari"
        ],
        [
          "Niseko View Plaza與午餐",
          "niseko"
        ],
        [
          "經倶知安，往HANAZONO",
          "kutchan"
        ],
        [
          "雪圈滑坡，玩一場冬天",
          "hanazono"
        ],
        [
          "經余市，慢慢前往小樽",
          "yoichi"
        ],
        [
          "OMO5入住與運河夜景",
          "otaru",
          "canal"
        ],
        [
          "なると本店，晚餐候選",
          "naruto"
        ]
      ]
    },
    {
      "title": "小樽購物 → 清田神社 → 札幌PARCO。",
      "city": "小樽 → 札幌",
      "stay": "PINN · 已預訂",
      "hero": "canal",
      "warning": "神社15時前完成 · 白色戀人移12/16 · 晚間甜點擇一",
      "rows": [
        [
          "小樽運河晨景",
          "canal"
        ],
        [
          "小樽吉伊卡哇",
          "chiikawa-otaru"
        ],
        [
          "找小樽Hello Kitty",
          "kitty"
        ],
        [
          "甜點、午餐與取行李",
          "letao",
          "kitakaro",
          "otaru"
        ],
        [
          "清田稻荷神社",
          "kiyota"
        ],
        [
          "PINN入住",
          "sapporo"
        ],
        [
          "札幌PARCO吉伊卡哇",
          "chiikawa-sapporo"
        ],
        [
          "市中心購物候選",
          "tanuki",
          "tnoc"
        ],
        [
          "札幌晚餐候選",
          "hanamaru",
          "hachikyo",
          "omaru"
        ],
        [
          "夜間甜點擇一",
          "nagare"
        ]
      ]
    },
    {
      "title": "白色戀人條件式安排 → 莫埃來商店 → 再住札幌。",
      "city": "札幌市區",
      "stay": "札幌加住一晚 · 未訂",
      "hero": "moere",
      "warning": "照片冰箱貼12月服務待確認 · 莫埃來商店17時關 · 12/16飯店未訂",
      "rows": [
        [
          "退房與前往公園",
          "sapporo"
        ],
        [
          "開門前抵達、確認服務",
          "memento"
        ],
        [
          "條件式送件",
          "memento"
        ],
        [
          "等待、午餐與取件",
          "memento"
        ],
        [
          "前往莫埃來",
          "moere"
        ],
        [
          "野口勇商店購物",
          "moere"
        ],
        [
          "回札幌入住",
          "sapporo-extra"
        ],
        [
          "晚餐與行前準備"
        ]
      ]
    },
    {
      "title": "長沼koyamame → 富良野精靈露台 → 白鬚瀑布 → 旭川。",
      "city": "札幌 → 長沼 → 富良野 → 美瑛 → 旭川",
      "stay": "旭川 · 飯店待訂",
      "hero": "koyamame",
      "warning": "咖啡廳以11時場規劃、未確認訂位 · 聖誕樹與餐廳需取捨 · 晚到取消白金支線",
      "rows": [
        [
          "札幌出發",
          "sapporo-extra"
        ],
        [
          "咖啡廳報到",
          "koyamame"
        ],
        [
          "koyamame包場",
          "koyamame"
        ],
        [
          "午餐與出發"
        ],
        [
          "往富良野",
          "ningle"
        ],
        [
          "森林精靈露台",
          "ningle"
        ],
        [
          "白樺街道交通段",
          "birch"
        ],
        [
          "白鬚瀑布夜景",
          "falls"
        ],
        [
          "旭川入住",
          "asahi"
        ],
        [
          "休息與翌日準備"
        ]
      ]
    },
    {
      "title": "旭山動物園 → 道央高速 → 登別。",
      "city": "旭川 → 旭山動物園 → 登別",
      "stay": "登別 · 飯店待訂",
      "hero": "zoo",
      "warning": "動物園移12/18 · 企鵝散步未保證 · 不走三國峠／十勝 · 登別晚到須確認",
      "rows": [
        [
          "旭川早餐退房",
          "asahi"
        ],
        [
          "前往旭山動物園",
          "zoo"
        ],
        [
          "旭山動物園",
          "zoo"
        ],
        [
          "午餐與離園",
          "zoo"
        ],
        [
          "高速南下登別",
          "noboribetsu"
        ],
        [
          "登別入住",
          "noboribetsu"
        ],
        [
          "休息準備返程"
        ]
      ]
    },
    {
      "title": "慢慢回函館，把冬天帶回家。",
      "city": "登別 → 函館機場 → 桃園",
      "stay": "今日返台",
      "hero": "onuma",
      "warning": "06:30出發 · 14:00結束觀光 · 15:00還車固定 · JX861 18:00起飛",
      "rows": [
        [
          "登別退房，沿高速回函館",
          "noboribetsu"
        ],
        [
          "機場周邊午餐，核對還車路線",
          "lunch"
        ],
        [
          "有餘裕才加碼，不固定排點"
        ],
        [
          "結束觀光，去加油"
        ],
        [
          "回Times，15:00前還車",
          "times"
        ],
        [
          "接駁到函館機場",
          "airport"
        ],
        [
          "JX861，回到台灣",
          "airport"
        ]
      ]
    }
  ];
  const alerts = {"1":{"6":"冬季纜車末班與風況以當晚公告為準。"},"2":{"4":"排隊不可壓縮15時取車。","8":"15時取車固定，駕照正本＋日文譯本＋護照。","13":"不為夜鳴拉麵趕車。"},"3":{"7":"13時只是規劃目標，當日登記、開放與空位未保證。"},"4":{"4":"15時後不可過鳥居登階。","9":"甜點擇一，未訂位。"},"5":{"1":"11/30加工服務終了公告範圍待確認，不能保證12月可做冰箱貼。","2":"服務確認後才下單，目前未製作、未付款。","3":"官方交付可能1–4小時，不保證14:30能取；延誤須縮短公園。","5":"商店17時關，AKARI款式庫存不保證。","6":"12/16新住宿未訂，不等於原PINN訂單續住。"},"6":{"2":"以11時場為前提、未收到訂位確認；13／15時場須重排。","5":"若冬季行車延誤，取消白金支線，不趕路。","7":"此時通常已天黑，不保證自然光蒂芬妮綠。"},"7":{"2":"12/18動物園保留，但企鵝散步仍未確認開走。","4":"冬季含休息預留4.5–6小時，暴雪可能更久。","5":"飯店未訂，不保證趕上一泊二食晚餐。"},"8":{"4":"15時還車固定，延誤時取消全部加碼。"}};
  const booked = {1:[2],3:[9],4:[5]};
  const optionalRows = {3:[10],4:[7,8,9],5:[1,2,3],6:[1,2],8:[2]};
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
  const link=(text,href,cls)=>{const n=el('a',cls,text);n.href=href;if(/^https?:/.test(href)){n.target='_blank';n.rel='noopener noreferrer';}return n;};
  const places=window.ITINERARY_PLACES, byId=id=>places.find(p=>p.id===id), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Preserve all public source paragraphs and official links in the information view.
  const noteFragments=originals.map(s=>s.cloneNode(true));
  const root=el('div');root.innerHTML=window.JOURNEY_SHELL;
  document.body.replaceChildren(...root.childNodes);document.body.className='journey';document.body.dataset.view='plan';
  document.querySelector('meta[name=theme-color]').content='#244d45';
  const design=document.getElementById('journey-design');design.media='all';
  document.querySelectorAll('link[href^="styles.css"]').forEach(n=>n.disabled=true);
  const $=s=>document.querySelector(s);
  let day=1,view='plan',filter='all',map,resizeObserver,route,rows=[],groups=[],optionalLayers,showExtras=false,selected;
  const globals=el('div','trip-notes');noteFragments.forEach(n=>globals.append(n));
  const info=$('.panel-info'),infoTitle=el('h2','','旅程資訊與完整註記');infoTitle.id='info-heading';info.replaceChildren(infoTitle,el('p','panel-intro','行程沿用既有紀錄；營業、活動與路況並非本次重新查證。公開頁不新增私人訂單或記帳。'),globals);
  const dayNotes=el('section','info-card day-notes');info.insertBefore(dayNotes,globals);
  const siteMenu=el('details','mobile-site-menu');siteMenu.append(el('summary','','全站選單'));const nav=$('.site-links').cloneNode(true);nav.setAttribute('aria-label','手機全站導覽');siteMenu.append(nav);$('.topbar>div').append(siteMenu);
  // Every details/photo block is open on first visit; readers may collapse it manually.
  function gallery(p,container){
    const anchor=el('div','place-anchor');if(!document.getElementById(`place-${day}-${p.id}`))anchor.id=`place-${day}-${p.id}`;container.append(anchor);
    container.append(el('p','place-description',p.note),el('span','gallery-label',`${p.name} · 3張參考照片`));
    const track=el('div','photo-track');track.tabIndex=0;track.setAttribute('aria-label',`${p.name}照片，可左右滑動`);
    p.photos.forEach((ph,i)=>{const fig=el('figure'),a=link('',ph.source);a.setAttribute('aria-label',`${p.name}照片${i+1}，查看來源`);const img=el('img');Object.assign(img,{src:ph.url,alt:`${p.name}參考照片${i+1}，非出遊當日現況`,loading:'lazy',decoding:'async',referrerPolicy:'no-referrer',width:600,height:375});img.addEventListener('error',()=>{img.hidden=true;a.append(el('span','photo-missing','圖片暫時無法載入，點此查看來源 ↗'));},{once:true});a.append(img);fig.append(a);const caption=el('figcaption','',`${i+1}/3 · ${ph.title} · `);caption.append(link(new URL(ph.source).hostname,ph.source));fig.append(caption);track.append(fig);});
    container.append(track,el('p','photo-help','← 左右滑動看三張照片 · 圖片權利歸原作者，非當日雪況／庫存保證'),link('Google Maps ↗',p.maps,'text-link'));
  }
  function details(ids,html){const d=el('details','stop-details');d.open=true;d.append(el('summary','',ids.length?'詳細註記與照片':'詳細行程註記'));const c=el('div','detail-content');if(html){const p=el('p','place-description full-source-note');p.innerHTML=html;c.append(p);}ids.forEach(id=>{const p=byId(id);if(p)gallery(p,c);});d.append(c);return d;}
  function badge(text,kind){return el('span',`badge ${kind}`,text);}
  function centerDate(){const n=$('.dates .active'),d=$('.dates');if(n)d.scrollLeft+=n.getBoundingClientRect().left-d.getBoundingClientRect().left-(d.clientWidth-n.clientWidth)/2;}
  function selection(key){selected=key;document.querySelectorAll('.timeline-card').forEach(c=>c.classList.toggle('selected',c.dataset.key===key));groups.forEach(g=>g.marker.getElement()?.classList.toggle('active',g.keys.includes(key)));const row=rows.find(r=>r.key===key);if(!row)return;const root=$('#map-selection');root.replaceChildren(el('span','selection-kicker',`${row.time} · ${row.tag}`),el('strong','',row.title),el('p','',row.alert||'選取對應時間軸停留。'));const b=el('button','','查看行程卡片 ↑');b.type='button';b.onclick=()=>{setView('plan');document.getElementById(key)?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});};root.append(b);}
  function focusRow(key){selection(key);const g=groups.find(g=>g.keys.includes(key)),row=rows.find(r=>r.key===key),extra=route.optional.find(p=>row?.points.includes(p.id));if(!g&&!extra)return;if(extra&&!g&&!showExtras)toggleExtras();if(innerWidth<=700)setView('map');requestAnimationFrame(()=>{map?.invalidateSize();map?.setView(g?g.marker.getLatLng():[extra.lat,extra.lon],13,{animate:!reduced});g?.marker.openPopup();});}
  function setView(next){view=next;document.body.dataset.view=next;document.querySelectorAll('button[data-view]').forEach(b=>{if(b.dataset.view===next)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});document.querySelectorAll('.panel').forEach(p=>p.hidden=!p.classList.contains(`panel-${next}`));if(next==='extras'&&!showExtras)toggleExtras();requestAnimationFrame(()=>{map?.invalidateSize();if(next==='map')fitMap();});}
  function fitMap(){if(map&&route)map.fitBounds(route.stops.concat(showExtras?route.optional:[]).map(p=>[p.lat,p.lon]),{padding:[30,30],maxZoom:14,animate:false});}
  function toggleExtras(){showExtras=!showExtras;$('#toggle-extras').setAttribute('aria-pressed',String(showExtras));$('#toggle-extras').lastChild.textContent=showExtras?'隱藏備選':'顯示備選';if(optionalLayers&&map)showExtras?optionalLayers.addTo(map):optionalLayers.removeFrom(map);}
  function initMap(){
    resizeObserver?.disconnect();map?.remove();map=null;window.journeyMap=null;groups=[];optionalLayers=null;
    const holder=$('#day-map');holder.replaceChildren();holder.setAttribute('aria-label',`12月${11+day}日完整主線順序與備選地圖`);
    if(!window.L){holder.append(el('p','map-fallback','互動地圖暫時無法載入，請用下方Google Maps連結。'));return;}
    map=L.map(holder,{scrollWheelZoom:false,center:[route.stops[0].lat,route.stops[0].lon],zoom:8});L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
    L.polyline(route.stops.map(p=>[p.lat,p.lon]),{color:'#416a52',weight:3,dashArray:'5 7'}).addTo(map);
    const combined=new Map();route.stops.forEach((p,i)=>{const k=`${p.lat.toFixed(5)},${p.lon.toFixed(5)}`;if(!combined.has(k))combined.set(k,{p,nums:[],keys:[]});const g=combined.get(k);g.nums.push(i+1);g.keys.push(...rows.filter(r=>r.points.includes(p.id)).map(r=>r.key));});
    combined.forEach(({p,nums,keys})=>{const icon=L.divIcon({className:`route-pin${nums.length>1?' combined':''}`,html:`<span>${nums.join('/')}</span>`,iconSize:[nums.length>1?42:26,26],iconAnchor:[13,13]});const marker=L.marker([p.lat,p.lon],{icon,title:`${nums.join('/')} ${p.name}`}).addTo(map);marker.bindPopup(el('p','',`${nums.join('/')} · ${p.name}`),{autoPan:false});marker.on('click',()=>{if(keys.length)selection(keys[0]);else $('#map-selection').replaceChildren(el('strong','',p.name),el('p','', '完整路線中的途經／住宿代表點。'));});groups.push({marker,keys});});
    optionalLayers=L.layerGroup();route.optional.forEach(p=>{const icon=L.divIcon({className:'route-pin extra-pin',html:'<span>備</span>',iconSize:[24,24],iconAnchor:[12,12]});const marker=L.marker([p.lat,p.lon],{icon,title:`備選：${p.name}`}).addTo(optionalLayers);marker.bindPopup(el('p','',`${byId(p.id)?.note?.startsWith('舊路線保留資料')?'舊路線、本版不前往':'備選、非固定停留'}：${p.name}`));marker.on('click',()=>{const place=byId(p.id);$('#map-selection').replaceChildren(el('span','selection-kicker','候選／舊路線 · 非固定主線'),el('strong','',p.name),el('p','',place?.note||'路線備選點，依時間與天候決定。'));});});
    if(showExtras)optionalLayers.addTo(map);resizeObserver=new ResizeObserver(()=>map?.invalidateSize());resizeObserver.observe(holder);requestAnimationFrame(()=>{map.invalidateSize();fitMap();});window.journeyMap=map;
  }
  function category(p){if(['okuno','tanuki','tnoc'].includes(p.id))return'shopping';if(/咖啡|甜|糰|拉麵|冰淇淋|羊肉|丼|漢堡|晚餐/.test(p.name+' '+p.note))return'food';return'sight';}
  function renderExtras(){const root=$('#extras-grid');root.replaceChildren();const q=$('#extra-search').value.trim().toLocaleLowerCase();let count=0;places.filter(p=>p.days.includes(day)&&route.optional.some(s=>s.id===p.id)).forEach(p=>{if(filter!=='all'&&category(p)!==filter)return;if(q&&!`${p.name} ${p.note}`.toLocaleLowerCase().includes(q))return;count++;const c=el('article','extra-card');const top=el('div','stop-main');top.append(badge(/舊路線保留資料/.test(p.note)?'舊路線・本版不前往':/休園/.test(p.name)?'休園・想去紀錄':'備選・需取捨','optional'),el('h3','',p.name));const b=el('button','text-link','在地圖上看 ↗');b.type='button';b.onclick=()=>{if(!showExtras)toggleExtras();setView('map');const point=route.optional.find(s=>s.id===p.id);requestAnimationFrame(()=>{map?.setView([point.lat,point.lon],13,{animate:false});$('#map-selection').replaceChildren(el('span','selection-kicker','備選 · 非固定主線'),el('strong','',p.name),el('p','',p.note));});};top.append(b);c.append(top,details([p.id]));root.append(c);});$('#extra-count').textContent=`${count} 個地點 · 不是必達行程`;$('#empty-extras').hidden=count!==0;}
  function renderDay(number){
    day=number;route=window.ITINERARY_ROUTES.find(d=>d.day===day);const cfg=configs[day-1],data=days[day-1];
    document.title=`北行日記｜12/${11+day} ${cfg.city}`;document.body.dataset.day=String(day);$('.day-hero .eyebrow').textContent=`DAY ${String(day).padStart(2,'0')} — ${data.date}`;$('.day-hero h1').textContent=cfg.title;$('.hero-sub').textContent=data.title;$('.hero-tags').replaceChildren(...[cfg.city,cfg.stay,'時間皆為日本時間'].map(t=>el('span','',t)));
    const ph=byId(cfg.hero)?.photos[0];if(ph){$('#hero-image').src=ph.url;$('#hero-image').alt=`${byId(cfg.hero).name}參考照片，非當日雪況`;$('#hero-source').href=ph.source;$('#hero-source').textContent='圖片來源 ↗';}$('.guardrails p').textContent=cfg.warning;
    $('.dates').querySelectorAll('a').forEach((a,i)=>{a.href=`#day-${i+1}`;a.title=`12/${12+i} ${configs[i].city}`;a.querySelector('span').textContent=['函館','東室蘭','小樽','札幌','札幌','長沼・旭川','動物園・登別','返台'][i];a.classList.toggle('active',i+1===day);if(i+1===day)a.setAttribute('aria-current','date');else a.removeAttribute('aria-current');});
    const target=$('#timeline');target.replaceChildren();const used=new Set();rows=data.entries.map((entry,i)=>{const [title,...points]=cfg.rows[i];const ids=points.filter(id=>byId(id)&&!used.has(id));ids.forEach(id=>used.add(id));const optional=(optionalRows[day]||[]).includes(i),isBooked=(booked[day]||[]).includes(i);return {...entry,title,points,ids,key:`day-${day}-stop-${i+1}`,tag:isBooked?'住宿已預訂':((day===5&&[1,2,3].includes(i))||(day===6&&[1,2].includes(i)))?'安排目標／待確認':optional?'彈性／候選':'已排入',kind:isBooked?'booked':optional?'optional':'planned',alert:alerts[day]?.[i]};});
    rows.forEach((r,i)=>{const article=el('article','timeline-card');article.id=r.key;article.dataset.key=r.key;article.append(el('span','stop-number',String(i+1).padStart(2,'0')));const card=el('div','stop-card'),main=el('div','stop-main'),meta=el('div','stop-meta');meta.append(el('span','stop-time',r.time),badge(r.tag,r.kind));const title=el('div','stop-title'),h=el('h3');const b=el('button','focus-stop',r.title);b.type='button';b.onclick=()=>focusRow(r.key);h.append(b);title.append(h);const p=byId(r.points[0]),point=route.stops.find(p=>p.id===r.points[0]);if(p||point)title.append(link('導航 ↗',p?.maps||`https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lon}`,'navigate'));main.append(meta,title);if(r.alert)main.append(el('p','stop-alert',`注意｜${r.alert}`));card.append(main,details(r.ids,r.html));article.append(card);target.append(article);});
    // Every main-line photo location remains available, even if it is only a pass-through stop.
    const remaining=places.filter(p=>p.days.includes(day)&&route.stops.some(s=>s.id===p.id)&&!used.has(p.id));remaining.forEach(p=>{const c=el('article','extra-card');const m=el('div','stop-main');m.append(badge('沿途／住宿資料','planned'),el('h3','',p.name));c.append(m,details([p.id]));target.append(c);});
    dayNotes.innerHTML=`<h3>12/${11+day} · 當日完整提醒</h3>${data.side}`;
    const inlineNotes=el('section','info-card day-notes');inlineNotes.innerHTML=`<p class="eyebrow">BEFORE YOU GO</p><h3>今天的完整註記</h3>${data.side}`;target.append(inlineNotes);
    $('.panel-plan .section-count').textContent=data.drive;$('.map-heading .eyebrow').textContent=cfg.city;$('.map-note').textContent=`${route.note||''} 連線只是完整停靠順序，不是可行駛道路；冬季管制與入口依當日導航確認。地圖編號依路線停靠點，與時間軸序號不同；重複位置合併顯示。`;
    const links=$('.route-links');links.replaceChildren();data.links.forEach(a=>links.append(link(a.text,a.href)));if(day===2)links.append(link('取車前函館步行停靠點 ↗','https://www.google.com/maps/dir/函館朝市/金森赤レンガ倉庫/アンジェリック+ヴォヤージュ/旧函館区公会堂/世界で2番めにおいしい焼き立てメロンパンアイス+函館元町店/滋養軒'));
    $('#extra-search').value='';filter='all';document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('selected',b.dataset.filter==='all');b.setAttribute('aria-pressed',String(b.dataset.filter==='all'));});renderExtras();initMap();selection(rows[0].key);setView(view);requestAnimationFrame(centerDate);
    window.journeyState={day,rows:rows.length,mainIds:[...used],optionalIds:route.optional.map(p=>p.id)};
  }
  function fromHash(){const h=decodeURIComponent(location.hash);const m=h.match(/^#(?:day-|place-)([1-8])(?:-|$)/);return {day:m?Number(m[1]):1,hash:h};}
  function navigate(){const n=fromHash();if(day!==n.day||!rows.length)renderDay(n.day);if(n.hash.startsWith('#place-')){const id=n.hash.slice(1);$('#extra-search').value='';filter='all';renderExtras();const item=document.getElementById(id);if(item){setView(item.closest('#extras-grid')?'extras':'plan');requestAnimationFrame(()=>{item.closest('details').open=true;item.scrollIntoView({behavior:'auto',block:'center'});});}}else if(n.hash&&!/^#day-/.test(n.hash)&&document.getElementById(n.hash.slice(1))){setView('info');requestAnimationFrame(()=>document.getElementById(n.hash.slice(1)).scrollIntoView({behavior:'auto',block:'start'}));}else window.scrollTo({top:0,behavior:'auto'});}
  document.querySelectorAll('button[data-view]').forEach(b=>b.onclick=()=>{setView(b.dataset.view);window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});});
  $('#show-info').onclick=()=>{setView('info');window.scrollTo({top:0,behavior:'auto'});};$('#fit-map').onclick=fitMap;$('#toggle-extras').onclick=toggleExtras;$('#extra-search').oninput=renderExtras;
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});renderExtras();});
  window.addEventListener('hashchange',navigate);navigate();
})();
