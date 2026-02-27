(() => {
  let isPerklone = true;
  const name = document.getElementById('display-name');
  const btn = document.getElementById('swap-btn');

  function toggle() {
    name.style.opacity = '0';
    name.style.transform = 'translateY(8px)';

    setTimeout(() => {
      isPerklone = !isPerklone;
      name.textContent = isPerklone ? 'Perklone' : 'Rizky Maulana';

      name.style.opacity = '1';
      name.style.transform = 'translateY(0)';
    }, 200);
  }

  name.addEventListener('click', toggle);
  btn.addEventListener('click', toggle);
})();
