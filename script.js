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
const storyList = document.querySelector('[data-story-list]');
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
  if (Number.isFinite(product.imageScale) && product.imageScale > 0) {
    image.style.setProperty('--product-scale', String(product.imageScale));
  }
  if (typeof product.imageShiftX === 'string' && product.imageShiftX.trim()) {
    image.style.setProperty('--product-shift-x', product.imageShiftX.trim());
  }
  if (typeof product.imageShiftY === 'string' && product.imageShiftY.trim()) {
    image.style.setProperty('--product-shift-y', product.imageShiftY.trim());
  }
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

  const buyLink = document.createElement('button');
  buyLink.className = 'catalog-buy';
  buyLink.type = 'button';
  buyLink.setAttribute('data-cart-add', '');
  buyLink.setAttribute('data-name', product.name);
  buyLink.setAttribute('data-price', String(product.price));
  buyLink.setAttribute('data-url', product.purchaseUrl);
  buyLink.setAttribute('aria-label', `${product.name} 장바구니에 담기`);
  buyLink.append('장바구니 담기 ');

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

    const featuredProducts = products.filter((product) => product.group !== 'other');
    const otherProducts = products.filter((product) => product.group === 'other');
    renderProducts(homeProducts, featuredProducts.length ? featuredProducts : products, { limit: 3, variant: 'home' });
    if (otherProducts.length) {
      renderProducts(productList, otherProducts);
    } else {
      setCatalogMessage(productList, '곧 다른 MWC 제품을 추가하겠습니다.', 'empty');
    }
    if (productCount) productCount.textContent = `PRODUCTS / ${String(otherProducts.length).padStart(2, '0')}`;
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

const formatStoryDate = (value) => {
  const parts = String(value || '').split('-');
  if (parts.length !== 3) return String(value || '');
  return `${parts[0]}.${parts[1]}.${parts[2]}`;
};

const getStoryUrl = (post) => {
  const customUrl = typeof post.url === 'string' ? post.url.trim() : '';
  if (customUrl) {
    if (/^(?:https?:)?\/\//i.test(customUrl) || customUrl.startsWith('/')) return customUrl;
    return `story/${customUrl.replace(/^\.\//, '')}`;
  }
  return `story/post.html?id=${encodeURIComponent(String(post.id || ''))}`;
};

const createStoryCard = (post, index) => {
  const article = document.createElement('article');
  article.className = 'story-card story-card-feed';

  const indexPanel = document.createElement('div');
  indexPanel.className = 'story-card-index';
  indexPanel.setAttribute('aria-hidden', 'true');
  const indexLabel = document.createElement('span');
  indexLabel.textContent = `FIELD NOTE / ${String(index + 1).padStart(2, '0')}`;
  const indexNumber = document.createElement('strong');
  indexNumber.textContent = String(index + 1).padStart(2, '0');
  indexPanel.append(indexLabel, indexNumber);

  const content = document.createElement('div');
  content.className = 'story-content';

  const meta = document.createElement('p');
  meta.className = 'story-meta';
  const time = document.createElement('time');
  time.dateTime = String(post.date || '');
  time.textContent = formatStoryDate(post.date);
  const category = document.createElement('span');
  category.textContent = 'JOURNAL';
  meta.append(time, category);

  const title = document.createElement('h3');
  title.textContent = String(post.title || '(제목 없음)');

  const summary = document.createElement('p');
  summary.textContent = String(post.summary || '');

  const link = document.createElement('a');
  link.className = 'read-status';
  link.href = getStoryUrl(post);
  link.setAttribute('aria-label', `${title.textContent} 읽기`);
  link.append('글 읽기 ');
  const arrow = document.createElement('span');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  link.append(arrow);

  content.append(meta, title);
  if (summary.textContent) content.append(summary);
  content.append(link);
  article.append(indexPanel, content);
  return article;
};

const setStoryMessage = (message, state) => {
  if (!storyList) return;
  const status = document.createElement('p');
  status.className = 'story-status';
  status.dataset.state = state;
  status.textContent = message;
  storyList.replaceChildren(status);
  storyList.setAttribute('aria-busy', 'false');
};

const loadStories = async () => {
  if (!storyList) return;

  try {
    const response = await fetch('./story/posts.json', {
      cache: 'no-cache',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`이야기 데이터 요청 실패: ${response.status}`);

    const posts = await response.json();
    if (!Array.isArray(posts) || posts.length === 0) {
      setStoryMessage('아직 등록된 이야기가 없습니다.', 'empty');
      return;
    }

    const latestPosts = posts
      .filter((post) => post && typeof post === 'object')
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
      .slice(0, 3);
    const fragment = document.createDocumentFragment();
    latestPosts.forEach((post, index) => fragment.append(createStoryCard(post, index)));
    storyList.replaceChildren(fragment);
    storyList.setAttribute('aria-busy', 'false');
  } catch (error) {
    const message = window.location.protocol === 'file:'
      ? '이야기 목록은 로컬 서버에서 확인할 수 있습니다.'
      : '이야기를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.';
    setStoryMessage(message, 'error');
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
loadStories();
