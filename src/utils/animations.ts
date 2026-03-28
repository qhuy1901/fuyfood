export function triggerFlyToCartAnimation(
  element: HTMLElement | null,
  imageUrl: string
) {
  if (!element) return;
  const startRect = element.getBoundingClientRect();
  const startX = startRect.left + startRect.width / 2;
  const startY = startRect.top + startRect.height / 2;

  // Find visible cart target
  const targets = Array.from(document.querySelectorAll('.nav-cart-target'));
  const target = targets.find((t) => {
    const r = t.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.top >= 0;
  });

  if (!target) return;
  const endRect = target.getBoundingClientRect();
  const endX = endRect.left + endRect.width / 2;
  const endY = endRect.top + endRect.height / 2;

  // Create wrapper for independent X and Y animations (to create an arc)
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '99999',
  });

  // Create flying image
  const flyImg = document.createElement('img');
  flyImg.src = imageUrl;
  
  // Base size of 60px
  const size = 60;
  Object.assign(flyImg.style, {
    position: 'absolute',
    top: `${startY - size / 2}px`,
    left: `${startX - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    willChange: 'transform, filter, opacity',
  });

  wrapper.appendChild(flyImg);
  document.body.appendChild(wrapper);

  // X-axis animation (linear-ish X movement)
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  
  wrapper.animate([
    { transform: 'translateX(0px)' },
    { transform: `translateX(${deltaX}px)` }
  ], {
    duration: 800,
    easing: 'linear',
    fill: 'forwards'
  });

  // Y-axis, rotation, scale, and blur animation (smoke effect + gravity arc)
  const anim = flyImg.animate([
    { 
      transform: 'translateY(0px) scale(1) rotate(0deg)',
      filter: 'blur(0px)',
      opacity: 1,
      offset: 0
    },
    {
      // Arc slightly upwards first, forming a cloud
      transform: `translateY(${Math.min(deltaY - 50, -100)}px) scale(1.4) rotate(90deg)`,
      filter: 'blur(3px)',
      opacity: 0.8,
      offset: 0.4
    },
    {
      // Plunge into the cart, dissolving like smoke
      transform: `translateY(${deltaY}px) scale(0.1) rotate(270deg)`,
      filter: 'blur(12px)',
      opacity: 0,
      offset: 1
    }
  ], {
    duration: 800,
    // Emulate gravity pulling it down after the upward burst
    easing: 'cubic-bezier(0.5, 0, 0.75, 0)',
    fill: 'forwards'
  });

  // Cleanup
  anim.onfinish = () => {
    if (document.body.contains(wrapper)) {
      document.body.removeChild(wrapper);
    }
  };
}
