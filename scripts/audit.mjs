import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const pages = ['index.html', 'itinerary.html', 'rental.html', 'weather.html', 'map.html', 'snowmobile.html', 'stays.html'];
const ctx = { window: {} };
for (const file of ['itinerary-places.js', 'itinerary-routes.js']) vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
const places = ctx.window.ITINERARY_PLACES;
const days = ctx.window.ITINERARY_ROUTES;
assert.equal(days.length, 8);
assert.equal(new Set(places.map(p => p.id)).size, places.length);
for (const place of places) {
  assert.equal(place.photos.length, 3, `${place.id}: photos`);
  assert.equal(new Set(place.photos.map(p => p.url)).size, 3, `${place.id}: distinct photos`);
  for (const day of place.days) assert(days[day - 1].stops.concat(days[day - 1].optional).some(s => s.id === place.id), `${place.id}: map day ${day}`);
}
assert(days[2].stops.some(s => s.id === 'hanazono'));
assert(days[2].optional.some(s => s.id === 'whiteisle'));
assert(days[4].optional.some(s => /美唄/.test(s.name)));
for (const [day, id] of [[5, 'mildseven'], [7, 'kofuku'], [7, 'koyamame']]) {
  assert(days[day - 1].optional.some(s => s.id === id), `${id}: pending candidate marker`);
  assert(!days[day - 1].stops.some(s => s.id === id), `${id}: not confirmed as primary stop`);
}
assert(places.find(p => p.id === 'mildseven').note.includes('歷史照片'), 'mildseven: historical photos warning');
assert(places.find(p => p.id === 'falls').note.includes('蒂芬妮綠'), 'falls: photo preference');
const dynamicIds = new Set(days.map(d => `day-${d.day}`));
for (const p of places) for (const day of p.days) dynamicIds.add(`place-${day}-${p.id}`);
for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0];
  assert(nav, `${file}: nav`);
  assert.equal([...nav.matchAll(/<a /g)].length, 7, `${file}: all pages accessible`);
  assert.equal([...nav.matchAll(/aria-current="page"/g)].length, 1, `${file}: active page`);
  for (const page of pages) assert(nav.includes(`href="${page}"`), `${file}: ${page} nav`);
  assert(!/202602188790|6398654/.test(html), `${file}: unmasked reservation`);
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|tel:|data:)/.test(href)) continue;
    const [target, hash] = href.split('#');
    const destination = path.resolve(root, (target || file).split('?')[0]);
    assert(fs.existsSync(destination), `${file}: missing ${href}`);
    if (hash) {
      const text = fs.readFileSync(destination, 'utf8');
      assert(text.includes(`id="${hash}"`) || (destination.endsWith('itinerary.html') && dynamicIds.has(hash)), `${file}: missing fragment ${href}`);
    }
  }
}
const weather = fs.readFileSync(path.join(root, 'weather.html'), 'utf8');
assert(!/尚未發布|要等 9\/18|走 274／237|千歲—支笏湖—函館|block_no=00&amp;/.test(weather));
const rental = fs.readFileSync(path.join(root, 'rental.html'), 'utf8');
assert(!rental.includes('上午開車遊函館'));
console.log(`PASS: ${pages.length} pages, ${places.length} places, 8 maps, 3 photos per place, navigation, local links, privacy and stale-content guards.`);
