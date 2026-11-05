(() => {
  let preference;
  try { preference = localStorage.getItem('league-guide-theme-v1'); } catch (_) {}
  const dark = preference === 'dark' || (preference !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
})();
