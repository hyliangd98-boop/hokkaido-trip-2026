# 北海道旅遊 2026

2026 年 12 月 12 日至 19 日的北海道旅遊資訊網站，使用純 HTML 與 CSS 製作並由 GitHub Pages 發布。

## 頁面

- `index.html`：航班資訊與旅程摘要
- `itinerary.html`：八天七夜函館—旭川冬季自駕行程、企鵝散步、每日路線與安全須知
- `rental.html`：Times 函館機場店租車預約摘要、取還車流程與冬季檢查清單
- `weather.html`：2026 年冬季展望、2025 年同期全北海道分區積雪比較
- `map.html`：Google Maps 旅遊清單與目前收錄地點
- `styles.css`：全站共用樣式

## 後續編輯

旅遊資訊以 HTML 為主。新增頁面時，沿用現有頁首、導覽與頁尾，並在既有頁面的導覽列加入新連結。

Google Maps 清單：<https://maps.app.goo.gl/SqKRLP3XDSe2Le6X7>
# 每日地圖與照片

`itinerary.html` 的每日行程附當天 Google Maps 路線，以及各景點、餐廳和備選活動的地點連結、三張參考照片。資料在 `itinerary-places.js`，由 `itinerary-gallery.js` 呈現；重複經過的地點在相應日期再次顯示。

照片保留原始來源與作者網站連結，圖片權利歸原作者。部分載入不穩定的圖片存於 `assets/places/`，資料中的 `originalUrl` 保留原圖連結。圖片不是出遊日期的實際雪況，也不保證活動開放。不得用其他店家、同張圖片的不同裁切或示意圖補足三張。
