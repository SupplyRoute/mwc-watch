const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const main = document.querySelector('main');
const navLinks = [...document.querySelectorAll('[data-nav-link]')];
const sections = [...document.querySelectorAll('[data-section]')];
const revealItems = [...document.querySelectorAll('[data-reveal]')];
const progressBar = document.querySelector('[data-progress]');
const progressText = document.querySelector('[data-rail-percent]');
const railSection = document.querySelector('[data-rail-section]');
const homeProducts = document.querySelector('[data-home-products]');
const productList = document.querySelector('[data-product-list]');
const productCount = document.querySelector('[data-product-count]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const priceFormatter = new Intl.NumberFormat('ko-KR');

const isProduct = (product) => (
  product
  && typeof product.name === 'string'
  && product.name.trim().length > 0
  && Number.isFinite(product.price)
  && product.price >= 0
  && typeof product.image === 'string'
  && product.image.trim().length > 0
  && typeof product.purchaseUrl === 'string'
  && product.purchaseUrl.trim().length > 0
);

const createProductCard = (product, index, variant = 'default') => {
  const card = document.createElement('article');
  card.className = `catalog-card catalog-card-${variant}`;

  const itemCode = document.createElement('p');
  itemCode.className = 'catalog-card-code';
  itemCode.textContent = `ITEM / ${String(index + 1).padStart(2, '0')}`;

  const figure = document.createElement('figure');
  figure.className = 'catalog-card-image';

  const image = document.createElement('img');
  image.src = product.image;
  image.alt = `${product.name} 제품 이미지`;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.referrerPolicy = 'no-referrer';
  image.addEventListener('error', () => {
    figure.classList.add('is-image-error');
    image.hidden = true;
  }, { once: true });
  figure.append(image);

  const body = document.createElement('div');
  body.className = 'catalog-card-body';

  const name = document.createElement('h3');
  name.textContent = product.name;

  const footer = document.createElement('div');
  footer.className = 'catalog-card-footer';

  const price = document.createElement('strong');
  price.className = 'catalog-card-price';
  price.textContent = `${priceFormatter.format(product.price)}원`;

  const buyLink = document.createElement('a');
  buyLink.className = 'catalog-buy';
  buyLink.href = product.purchaseUrl;
  buyLink.target = '_blank';
  buyLink.rel = 'noopener noreferrer';
  buyLink.setAttribute('aria-label', `${product.name} 구매하기(새 탭)`);
  buyLink.append('구매하기 ');

  const arrow = document.createElement('span');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  buyLink.append(arrow);

  footer.append(price, buyLink);
  body.append(name, footer);
  card.append(itemCode, figure, body);
  return card;
};

const setCatalogMessage = (container, message, state = 'loading') => {
  if (!container) return;
  container.replaceChildren();
  const status = document.createElement('p');
  status.className = 'catalog-status';
  status.dataset.state = state;
  status.textContent = message;
  container.append(status);
  container.setAttribute('aria-busy', 'false');
};

const renderProducts = (container, products, { limit, variant } = {}) => {
  if (!container) return;
  const visibleProducts = typeof limit === 'number' ? products.slice(0, limit) : products;
  const fragment = document.createDocumentFragment();
  visibleProducts.forEach((product, index) => {
    fragment.append(createProductCard(product, index, variant));
  });
  container.replaceChildren(fragment);
  container.setAttribute('aria-busy', 'false');
};

const loadProducts = async () => {
  if (!homeProducts && !productList) return;

  try {
    const response = await fetch('./products.json', {
      cache: 'no-cache',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`제품 데이터 요청 실패: ${response.status}`);

    const products = await response.json();
    if (!Array.isArray(products) || products.length === 0) {
      setCatalogMessage(homeProducts, '등록된 제품이 없습니다.', 'empty');
      setCatalogMessage(productList, '등록된 제품이 없습니다.', 'empty');
      if (productCount) productCount.textContent = 'PRODUCTS / 00';
      return;
    }
    if (!products.every(isProduct)) throw new Error('제품 데이터 형식이 올바르지 않습니다.');

    renderProducts(homeProducts, products, { limit: 3, variant: 'home' });
    renderProducts(productList, products);
    if (productCount) productCount.textContent = `PRODUCTS / ${String(products.length).padStart(2, '0')}`;
  } catch (error) {
    const message = window.location.protocol === 'file:'
      ? '제품 목록은 로컬 서버에서 확인할 수 있습니다.'
      : '제품 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.';
    setCatalogMessage(homeProducts, message, 'error');
    setCatalogMessage(productList, message, 'error');
    if (productCount) productCount.textContent = 'PRODUCTS / ERROR';
    console.error(error);
  }
};

const closeMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('.sr-only').textContent = '메뉴 열기';
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  main.removeAttribute('inert');
};

window.mwcToggleMenu = () => {
  const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  menuToggle.querySelector('.sr-only').textContent = willOpen ? '메뉴 닫기' : '메뉴 열기';
  nav.classList.toggle('is-open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
  if (willOpen) main.setAttribute('inert', '');
  else main.removeAttribute('inert');
};

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});

const setActiveSection = (section) => {
  const id = section.id;
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  railSection.textContent = section.dataset.sectionName;
};

if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

let ticking = false;
const updateScrollData = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  const percent = Math.round(ratio * 100);
  progressBar.style.height = `${percent}%`;
  progressText.textContent = `${String(percent).padStart(3, '0')}%`;
  header.classList.toggle('is-scrolled', window.scrollY > 12);
  const marker = window.innerHeight * .35;
  let currentSection = sections[0];
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) currentSection = section;
  });
  setActiveSection(currentSection);
  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollData);
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  if (window.innerWidth > 860 && nav.classList.contains('is-open')) closeMenu();
  updateScrollData();
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
setActiveSection(sections[0]);
updateScrollData();
loadProducts();
