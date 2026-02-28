(() => {
  const stack = document.getElementById('card-stack');
  if (!stack) return;

  const cards = stack.querySelectorAll('.card-stack-item');
  const total = cards.length;
  let currentIndex = 0;
  let animating = false;
  const hint = document.getElementById('swipe-hint');

  function positionCards() {
    cards.forEach((card, i) => {
      const offset = (i - currentIndex + total) % total;
      card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.zIndex = total - offset;

      if (offset === 0) {
        card.style.transform = 'translate3d(8px, 0, 0) rotate(6deg)';
        card.style.opacity = '1';
      } else if (offset === 1) {
        card.style.transform = 'translate3d(-12px, 8px, 0) rotate(-2deg) scale(0.97)';
        card.style.opacity = '0.7';
      } else {
        card.style.transform = 'translate3d(-32px, 16px, 0) rotate(-10deg) scale(0.94)';
        card.style.opacity = '0.45';
      }
    });
  }

  function deal(dir) {
    if (animating) return;
    animating = true;
    dir = dir || 'left';

    if (hint) hint.style.display = 'none';

    const topCard = cards[currentIndex];
    topCard.classList.remove('breathing');

    const exitTransform = dir === 'right'
      ? 'translate3d(120%, 0, 0) rotate(15deg) scale(0.9)'
      : 'translate3d(-120%, 0, 0) rotate(-15deg) scale(0.9)';

    topCard.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease';
    topCard.style.transform = exitTransform;
    topCard.style.opacity = '0';

    topCard.addEventListener('transitionend', function onEnd(e) {
      if (e.propertyName !== 'transform') return;
      topCard.removeEventListener('transitionend', onEnd);

      topCard.style.transition = 'none';
      topCard.style.transform = 'translate3d(-32px, 16px, 0) rotate(-10deg) scale(0.94)';
      topCard.style.zIndex = 0;

      currentIndex = (currentIndex + 1) % total;

      void topCard.offsetHeight;

      topCard.style.transition = 'opacity 0.3s ease';
      topCard.style.opacity = '0.45';

      positionCards();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => { animating = false; });
      });
    });
  }

  // Click to deal (desktop only)
  let didTouch = false;
  stack.addEventListener('click', () => {
    if (!didTouch) deal();
    didTouch = false;
  });
  stack.style.cursor = 'pointer';

  // Breathe effect on hover
  stack.addEventListener('mouseenter', () => {
    if (!animating) cards[currentIndex].classList.add('breathing');
  });
  stack.addEventListener('mouseleave', () => {
    cards.forEach(c => c.classList.remove('breathing'));
  });

  // Swipe to deal (up or left)
  let touchStartX = 0;
  let touchStartY = 0;
  let swiping = false;
  stack.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    swiping = true;
    didTouch = true;
    if (!animating) cards[currentIndex].classList.add('breathing');
  }, { passive: true });
  stack.addEventListener('touchmove', (e) => {
    if (!swiping) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (dy < -10 || Math.abs(dx) > 10) e.preventDefault();
  }, { passive: false });
  stack.addEventListener('touchend', (e) => {
    swiping = false;
    cards.forEach(c => c.classList.remove('breathing'));
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (dy < -40 || dx < -40) {
      deal('left');
    } else if (dx > 40) {
      deal('right');
    }
  });

  positionCards();
})();
