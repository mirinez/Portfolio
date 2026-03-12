/* 
  script.js | PORTFOLIO
  Míriam Domínguez Martínez
*/

/* ============================================================
   THEME TOGGLE
*/

const toggle = document.getElementById('themeToggle');
const icon   = toggle.querySelector('.theme-icon');

/* Restore saved preference on load */
if (localStorage.getItem('theme') === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
  icon.textContent = '○';
}

/* Toggle on click */
toggle.addEventListener('click', () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  icon.textContent = isDark ? '◐' : '○';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

