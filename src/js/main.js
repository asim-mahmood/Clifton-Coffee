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


document.addEventListener('DOMContentLoaded', () => {
  // Map each carousel element → its control object
  const carouselInstances = new Map();

  // 1) Initialization function for a single carousel
  function initSingleViewCarousel(carousel) {
    const track   = carousel.querySelector('.svc-track');
    const slides  = Array.from(track.children);
    const prevBtn = carousel.querySelector('.svc-prev');
    const nextBtn = carousel.querySelector('.svc-next');
    const visible = 3;  // how many slides should show at once
    const gap     = parseFloat(getComputedStyle(track).gap) || 0;

    let allSlides, slideWidth, index;

    // --- clone start & end slides for infinite loop ---
    function cloneSlides() {
      // remove any previous clones
      track.querySelectorAll('.clone').forEach(c => c.remove());

      const real = Array.from(track.children);
      const prepend = real.slice(-visible).map(s => {
        const c = s.cloneNode(true);
        c.classList.add('clone');
        return c;
      });
      const append  = real.slice(0, visible).map(s => {
        const c = s.cloneNode(true);
        c.classList.add('clone');
        return c;
      });

      prepend.forEach(c => track.insertBefore(c, track.firstChild));
      append.forEach(c => track.appendChild(c));

      allSlides = Array.from(track.children);
      index = visible;
    }

    // --- measure slide width + update transform ---
    function calcSlideWidth() {
      // use the *first real* slide for width
      const firstReal = track.querySelector('.clone') 
        ? track.querySelectorAll('.svc-slide:not(.clone)')[0] 
        : slides[0];
      slideWidth = firstReal.offsetWidth + gap;
    }
    function update(animate = true) {
      track.style.transition = animate ? 'transform 0.4s ease' : 'none';
      track.style.transform  = `translateX(${-index * slideWidth}px)`;
    }

    // --- wraparound logic on transition end ---
    function wrapIfNeeded() {
      const handler = () => {
        track.removeEventListener('transitionend', handler);
        if (index >= allSlides.length - visible) {
          // moved past real end → jump to real start
          index = visible;
          update(false);
        } else if (index < visible) {
          // moved before real start → jump to real end
          index = allSlides.length - visible * 2;
          update(false);
        }
      };
      track.addEventListener('transitionend', handler);
    }

    // --- button handlers ---
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

    // --- public API for this instance ---
    function recalcAndUpdate() {
      cloneSlides();
      calcSlideWidth();
      update(false);
    }

    // --- handle window resize ---
    window.addEventListener('resize', recalcAndUpdate);

    // --- first setup & return control object ---
    recalcAndUpdate();
    return { recalcAndUpdate };
  }

  // initialize every carousel on the page
  document.querySelectorAll('.single-view-carousel').forEach(carousel => {
    carouselInstances.set(
      carousel,
      initSingleViewCarousel(carousel)
    );
  });

  // 2) Tab switching logic
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // deactivate all buttons & contents
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // activate this button + its target content
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      target.classList.add('active');

      // recalc the carousel inside the newly active tab
      const carousel = target.querySelector('.single-view-carousel');
      if (carousel && carouselInstances.has(carousel)) {
        carouselInstances.get(carousel).recalcAndUpdate();
      }
    });
  });

  // 3) On load, ensure the carousel in the already‑active tab is correct
  const activeTab = document.querySelector('.tab-content.active');
  if (activeTab) {
    const carousel = activeTab.querySelector('.single-view-carousel');
    if (carousel && carouselInstances.has(carousel)) {
      carouselInstances.get(carousel).recalcAndUpdate();
    }
  }
});




//text scroll section 


(function () {
  const items = document.querySelectorAll('.textCarousel-item');
  const dots  = document.querySelectorAll('.indicator-dot');
  const imgs  = document.querySelectorAll('.display-img');
  const wrapper = document.getElementById('textCarousel');
  let active = 0;

  function setActive(index) {
    // teardown old
    items[active].classList.remove('active');
    dots [active].classList.remove('active');
    imgs [active].classList.remove('active');
    // set new
    active = index;
    items[active].classList.add('active');
    dots [active].classList.add('active');
    imgs [active].classList.add('active');
  }

  // click handlers
  items.forEach((item, i) => item.addEventListener('click', () => setActive(i)));
  dots .forEach((dot,  i) => dot .addEventListener('click', () => {
    wrapper.scrollTo({ top: items[i].offsetTop, behavior: 'smooth' });
    setActive(i);
  }));

  // SCROLL handler using offsetTop
  wrapper.addEventListener('scroll', () => {
  const scrollY    = wrapper.scrollTop;
  const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
  let   closestIndex = 0;
  let   minDiff      = Infinity;

  // If we’re at (or within 2px of) the bottom, just pick the last item
  if (maxScroll - scrollY <= 2) {
    closestIndex = items.length - 1;
  } else {
    items.forEach((item, i) => {
      const diff = Math.abs(item.offsetTop - scrollY);
      if (diff < minDiff) {
        minDiff      = diff;
        closestIndex = i;
      }
    });
  }

  if (closestIndex !== active) setActive(closestIndex);
});


  // kick things off
  setActive(0);
})();


//newproducta