(() => {
  const tabs = document.querySelectorAll('.writing-tab');
  const panels = document.querySelectorAll('.writing-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(p => {
        p.classList.toggle('hidden', p.dataset.panel !== target);
      });
    });
  });
})();
