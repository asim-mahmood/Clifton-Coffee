import './utils.js';
import './events.js';
import './dom.js';

// Search Overlay
const openBtn = document.getElementById('openSearch');
const closeBtn = document.getElementById('closeSearch');
const overlay = document.getElementById('searchOverlay');

// show overlay
openBtn.addEventListener('click', e => {
  e.preventDefault();
  overlay.classList.add('active');
});

// hide overlay
closeBtn.addEventListener('click', () => {
  overlay.classList.remove('active');
});

// also hide if user presses ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') overlay.classList.remove('active');
});


// Cart Sidebar
const cartOpenBtn = document.getElementById('openCart');
const cartCloseBtn = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');

function openCart() {
  cartOverlay.classList.add('active');
  cartSidebar.classList.add('active');
}
function closeCart() {
  cartOverlay.classList.remove('active');
  cartSidebar.classList.remove('active');
}

cartOpenBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// carousel 
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCart();
});
// document.addEventListener('DOMContentLoaded', () => {
//   const track = document.querySelector('.carousel-track');
//   const originalSlides = Array.from(track.children);
//   const slidesPerView = 3;
//   let currentIndex = slidesPerView;

//   // Clone slides
//   const startClones = originalSlides.slice(0, slidesPerView).map(s => s.cloneNode(true));
//   const endClones = originalSlides.slice(-slidesPerView).map(s => s.cloneNode(true));
//   endClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));
//   startClones.forEach(clone => track.appendChild(clone));
//   const allSlides = Array.from(track.children);

//   // Compute slideWidth including gap
//   function getSlideWidth() {
//     const slide = track.querySelector('.carousel-slide');
//     const style = window.getComputedStyle(track);
//     const gap = parseFloat(style.gap) || 0;
//     return slide.getBoundingClientRect().width + gap;
//   }
//   let slideWidth = getSlideWidth();

//   // Initial position at first real slide
//   track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;

//   // Dots for each original slide
//   const dotsNav = document.querySelector('.carousel-dots');
//   originalSlides.forEach((_, i) => {
//     const dot = document.createElement('span');
//     dot.className = 'carousel-dot';
//     if (i === 0) dot.classList.add('active');
//     dot.addEventListener('click', () => moveTo(i + slidesPerView));
//     dotsNav.appendChild(dot);
//   });
//   const dots = Array.from(dotsNav.children);

//   // Button handlers
//   document.querySelector('.carousel-button.right').addEventListener('click', () => moveTo(currentIndex + 1));
//   document.querySelector('.carousel-button.left').addEventListener('click', () => moveTo(currentIndex - 1));

//   // On resize, recalc width and reposition
//   window.addEventListener('resize', () => {
//     slideWidth = getSlideWidth();
//     track.style.transition = 'none';
//     track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
//   });

//   // Looping logic
//   track.addEventListener('transitionend', () => {
//     const total = allSlides.length;
//     if (currentIndex >= total - slidesPerView) currentIndex = slidesPerView;
//     if (currentIndex < slidesPerView) currentIndex = total - slidesPerView * 2;
//     track.style.transition = 'none';
//     track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
//     updateDots();
//   });

//   function moveTo(index) {
//     currentIndex = index;
//     track.style.transition = 'transform 0.5s ease-in-out';
//     track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
//   }

//   function updateDots() {
//     const realIndex = (currentIndex - slidesPerView + originalSlides.length) % originalSlides.length;
//     dots.forEach(d => d.classList.remove('active'));
//     dots[realIndex].classList.add('active');
//   }
// });

//New Product Section

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const originalSlides = Array.from(track.children);
  const totalOriginal = originalSlides.length;
  const dotsNav = document.querySelector('.carousel-dots');
  const btnLeft = document.querySelector('.carousel-button.left');
  const btnRight = document.querySelector('.carousel-button.right');

  if (totalOriginal === 0) return;

  // Safe default
  let slidesPerView = 3;

  // Adjust if not enough slides
  if (totalOriginal < slidesPerView * 2) {
    slidesPerView = Math.max(1, Math.floor(totalOriginal / 2));
  }

  let currentIndex = slidesPerView;

  // Clone slides if enough exist
  if (totalOriginal >= slidesPerView * 2) {
    const startClones = originalSlides.slice(0, slidesPerView).map(s => s.cloneNode(true));
    const endClones = originalSlides.slice(-slidesPerView).map(s => s.cloneNode(true));
    endClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));
    startClones.forEach(clone => track.appendChild(clone));
  } else {
    currentIndex = 0; // no need to offset when no clones
  }

  const allSlides = Array.from(track.children);

  // Compute slide width (including gap)
  function getSlideWidth() {
    const slide = track.querySelector('.carousel-slide');
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 0;
    return slide.getBoundingClientRect().width + gap;
  }
  let slideWidth = getSlideWidth();

  // Set initial position
  track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;

  // Create dots
  originalSlides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'carousel-dot';
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moveTo(i + (currentIndex > 0 ? slidesPerView : 0)));
    dotsNav.appendChild(dot);
  });
  const dots = Array.from(dotsNav.children);

  // Move to a specific index
  function moveTo(index) {
    if (!allSlides.length) return;
    currentIndex = index;
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
    updateDots();
  }

  // Update active dot
  function updateDots() {
    if (!dots.length) return;
    const realIndex = (currentIndex - slidesPerView + totalOriginal) % totalOriginal;
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[realIndex]) dots[realIndex].classList.add('active');
  }

  // Navigation buttons
  btnRight.addEventListener('click', () => moveTo(currentIndex + 1));
  btnLeft.addEventListener('click', () => moveTo(currentIndex - 1));

  // Resize handling
  window.addEventListener('resize', () => {
    slideWidth = getSlideWidth();
    track.style.transition = 'none';
    track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
  });

  // Looping
  track.addEventListener('transitionend', () => {
    const total = allSlides.length;
    if (currentIndex >= total - slidesPerView) currentIndex = slidesPerView;
    if (currentIndex < slidesPerView) currentIndex = total - slidesPerView * 2;
    track.style.transition = 'none';
    track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
    updateDots();
  });

  // Hide controls if not enough slides
  if (totalOriginal <= 1) {
    btnLeft.style.display = 'none';
    btnRight.style.display = 'none';
    dotsNav.style.display = 'none';
  }

  // Close cart on ESC (if applicable)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (typeof closeCart === 'function') closeCart();
    }
  });
});

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

// new product carousel
(function () {
  const carousel = document.querySelector('.single-view-carousel');
  const track = carousel.querySelector('.svc-track');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('.svc-prev');
  const nextBtn = carousel.querySelector('.svc-next');
  const visible = 3;                // # of slides visible
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  let slideWidth;
  let index;

  // 1) clone slides
  const prependClones = slides.slice(-visible).map(slide => slide.cloneNode(true));
  const appendClones = slides.slice(0, visible).map(slide => slide.cloneNode(true));
  prependClones.forEach(clone => track.insertBefore(clone, track.firstChild));
  appendClones.forEach(clone => track.appendChild(clone));

  // 2) recalc full list
  const allSlides = Array.from(track.children);
  index = visible;  // start at the “real” first slide

  function calcSlideWidth() {
    // width of one slide + gap
    slideWidth = carousel.offsetWidth / visible + gap;
  }

  function update(animate = true) {
    track.style.transition = animate ? 'transform 0.4s ease' : 'none';
    track.style.transform = `translateX(${-index * slideWidth}px)`;
  }

  function wrapIfNeeded() {
    // after sliding, jump without animation if we're in cloned area
    track.addEventListener('transitionend', function handler() {
      track.removeEventListener('transitionend', handler);
      if (index >= allSlides.length - visible) {
        // jumped past end → reset to real first
        index = visible;
        update(false);
      } else if (index < visible) {
        // jumped past beginning → reset to real last
        index = allSlides.length - visible * 2;
        update(false);
      }
    });
  }

  prevBtn.addEventListener('click', () => {
    index--;
    update();
    wrapIfNeeded();
  });

  nextBtn.addEventListener('click', () => {
    index++;
    update();
    wrapIfNeeded();
  });

  window.addEventListener('resize', () => {
    calcSlideWidth();
    update(false);
  });

  // init
  calcSlideWidth();
  update(false);
})();










//text scroll section 

(function () {
  const items = document.querySelectorAll('.textCarousel-item');
  const dots = document.querySelectorAll('.indicator-dot');
  const imgs = document.querySelectorAll('.display-img');
  const titleEl = document.querySelector('.img-title');
  const wrapper = document.getElementById('textCarousel');
  let active = 0;
  const titles = ['Clifton Capsules', 'Clifton Tea', 'Clifton Chai', 'Clifton Hot Chocolate', 'Clifton Coffee'];

  function setActive(index) {
    items[active].classList.remove('active');
    dots[active].classList.remove('active');
    imgs[active].classList.remove('active');
    active = index;
    items[active].classList.add('active');
    dots[active].classList.add('active');
    imgs[active].classList.add('active');
    // titleEl.textContent = titles[active];
  }

  items.forEach((item, i) => item.addEventListener('click', () => setActive(i)));
  dots.forEach((dot, i) => dot.addEventListener('click', () => setActive(i)));
  wrapper.addEventListener('scroll', () => {
    const idx = Array.from(items).findIndex(item => item.getBoundingClientRect().top >= wrapper.getBoundingClientRect().top - 10);
    if (idx !== -1 && idx !== active) setActive(idx);
  });

  // Initialize
  setActive(0);
})();