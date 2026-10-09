document.querySelectorAll('.place-image-link img').forEach(img => {
  const fallback = () => {
    img.hidden = true;
    const link = img.parentElement;
    link.classList.add('image-unavailable');
    if (!link.querySelector('span')) {
      const text = document.createElement('span');
      text.textContent = '圖片暫時無法載入\n點此查看原始來源 ↗';
      link.append(text);
    }
  };
  img.addEventListener('error', fallback, { once:true });
});
