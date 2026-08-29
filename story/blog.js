(function () {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const main = document.querySelector('main');
  const navLinks = [...document.querySelectorAll('[data-nav-link]')];

  const closeMenu = () => {
    if (!menuToggle || !nav || !main) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    const label = menuToggle.querySelector('.sr-only');
    if (label) label.textContent = '메뉴 열기';
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    main.removeAttribute('inert');
  };

  window.mwcToggleMenu = () => {
    if (!menuToggle || !nav || !main) return;
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    const label = menuToggle.querySelector('.sr-only');
    if (label) label.textContent = willOpen ? '메뉴 닫기' : '메뉴 열기';
    nav.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
    if (willOpen) main.setAttribute('inert', '');
    else main.removeAttribute('inert');
  };

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && nav && nav.classList.contains('is-open')) closeMenu();
  });

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  const formatDate = (value) => {
    const parts = String(value || '').split('-');
    if (parts.length !== 3) return String(value || '');
    return `${parts[0]}. ${Number(parts[1])}. ${Number(parts[2])}.`;
  };

  const hrefOf = (post) => {
    const customUrl = typeof post.url === 'string' ? post.url.trim() : '';
    if (customUrl && !/^javascript:/i.test(customUrl)) return customUrl;
    return `post.html?id=${encodeURIComponent(String(post.id || ''))}`;
  };

  const loadPosts = () => fetch('posts.json', {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  }).then((response) => {
    if (!response.ok) throw new Error(String(response.status));
    return response.json();
  });

  const sortPosts = (posts) => (Array.isArray(posts) ? posts : [])
    .slice()
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  const renderList = (posts) => {
    const list = document.querySelector('[data-post-list]');
    if (!list) return;
    const sorted = sortPosts(posts);
    list.replaceChildren();

    if (sorted.length === 0) {
      const empty = el('li', 'blog-empty');
      empty.append(el('strong', null, '아직 올라온 글이 없습니다'));
      empty.append(document.createTextNode('첫 번째 이야기를 준비하고 있어요. 곧 만나요.'));
      list.append(empty);
      list.setAttribute('aria-busy', 'false');
      return;
    }

    const fragment = document.createDocumentFragment();
    sorted.forEach((post, index) => {
      const item = el('li', 'blog-list-card');
      const link = el('a');
      link.href = hrefOf(post);

      const meta = el('div', 'blog-list-meta');
      const time = el('time', null, formatDate(post.date));
      time.dateTime = String(post.date || '');
      meta.append(time, el('span', null, `FIELD NOTE / ${String(index + 1).padStart(2, '0')}`));
      link.append(meta, el('h2', null, String(post.title || '(제목 없음)')));

      if (post.summary) link.append(el('p', 'blog-summary', String(post.summary)));
      if (Array.isArray(post.tags) && post.tags.length) {
        const tags = el('div', 'blog-tags');
        post.tags.forEach((tag) => tags.append(el('span', 'blog-tag', String(tag))));
        link.append(tags);
      }

      item.append(link);
      fragment.append(item);
    });
    list.append(fragment);
    list.setAttribute('aria-busy', 'false');
  };

  const renderListError = () => {
    const list = document.querySelector('[data-post-list]');
    if (!list) return;
    list.replaceChildren(el('li', 'blog-error', '글 목록을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.'));
    list.setAttribute('aria-busy', 'false');
  };

  const renderBody = (source) => {
    const box = el('div', 'post-body');
    const appendInlineText = (parent, text) => {
      const pattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|[^)\s]+\.html|[^)\s]+\/)\)/g;
      let cursor = 0;
      let match = pattern.exec(text);
      while (match) {
        if (match.index > cursor) parent.append(document.createTextNode(text.slice(cursor, match.index)));
        const link = el('a', null, match[1]);
        link.href = match[2];
        if (/^https?:\/\//i.test(match[2])) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        parent.append(link);
        cursor = pattern.lastIndex;
        match = pattern.exec(text);
      }
      if (cursor < text.length) parent.append(document.createTextNode(text.slice(cursor)));
    };
    const blocks = String(source || '').replace(/\r\n/g, '\n').split(/\n\s*\n/);
    blocks.forEach((rawBlock) => {
      const block = rawBlock.trim();
      if (!block) return;
      const lines = block.split('\n');
      if (lines.every((line) => /^- /.test(line.trim()))) {
        const list = el('ul');
        lines.forEach((line) => {
          const item = el('li');
          appendInlineText(item, line.trim().slice(2));
          list.append(item);
        });
        box.append(list);
      } else if (/^## /.test(block)) {
        box.append(el('h2', null, block.slice(3).trim()));
      } else {
        const paragraph = el('p');
        appendInlineText(paragraph, block);
        box.append(paragraph);
      }
    });
    return box;
  };

  const setAttribute = (selector, attribute, value) => {
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attribute, value);
  };

  const addStructuredData = (data) => {
    const node = document.createElement('script');
    node.type = 'application/ld+json';
    node.textContent = JSON.stringify(data);
    document.head.append(node);
  };

  const setPostMeta = (post) => {
    const title = String(post.title || '이야기');
    const description = String(post.description || post.summary || '').slice(0, 160);
    const canonicalUrl = new URL(window.location.href);
    canonicalUrl.hash = '';
    const url = canonicalUrl.href;
    const author = String(post.author || '').trim();

    document.title = `${title} — MWC 시계`;
    setAttribute('meta[name="description"]', 'content', description);
    setAttribute('meta[name="author"]', 'content', author);
    setAttribute('link[rel="canonical"]', 'href', url);
    setAttribute('meta[property="og:title"]', 'content', title);
    setAttribute('meta[property="og:description"]', 'content', description);
    setAttribute('meta[property="og:url"]', 'content', url);

    const article = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      datePublished: String(post.date || ''),
      dateModified: String(post.updated || post.date || ''),
      mainEntityOfPage: url,
      keywords: Array.isArray(post.tags) ? post.tags.map(String).join(', ') : '',
    };
    if (author) article.author = { '@type': 'Person', name: author };
    addStructuredData(article);

    const faq = Array.isArray(post.faq) ? post.faq.filter((item) => item && item.q && item.a) : [];
    if (faq.length) {
      addStructuredData({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: String(item.q),
          acceptedAnswer: { '@type': 'Answer', text: String(item.a) },
        })),
      });
    }

    addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '이야기', item: new URL('./', window.location.href).href },
        { '@type': 'ListItem', position: 2, name: title, item: url },
      ],
    });
  };

  const renderFaq = (items) => {
    const section = el('section', 'blog-faq');
    section.append(el('h2', null, '자주 묻는 질문'));
    items.forEach((item) => {
      const details = el('details');
      details.append(el('summary', null, String(item.q)), el('p', null, String(item.a)));
      section.append(details);
    });
    return section;
  };

  const renderSources = (items) => {
    const section = el('section', 'blog-sources');
    section.append(el('h2', null, '참고·출처'));
    const list = el('ol');
    items.forEach((item) => {
      const listItem = el('li');
      const url = item && typeof item.url === 'string' ? item.url.trim() : '';
      if (/^https?:\/\//i.test(url)) {
        const link = el('a', null, String(item.title || url));
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        listItem.append(link);
      } else {
        listItem.textContent = String((item && item.title) || item || '');
      }
      list.append(listItem);
    });
    section.append(list);
    return section;
  };

  const renderNotFound = () => {
    const postMain = document.querySelector('[data-post-main]');
    if (!postMain) return;
    const box = el('div', 'blog-notfound');
    box.append(el('h1', null, '글을 찾을 수 없습니다'));
    box.append(el('p', null, '주소가 잘못되었거나 삭제된 글일 수 있어요.'));
    const link = el('a', null, '글 목록으로 돌아가기');
    link.href = 'index.html';
    box.append(link);
    postMain.replaceChildren(box);
    postMain.setAttribute('aria-busy', 'false');
  };

  const renderPost = (posts) => {
    const postMain = document.querySelector('[data-post-main]');
    if (!postMain) return;
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id') || query.get('slug');
    const sorted = sortPosts(posts);
    const index = sorted.findIndex((post) => (
      String(post.id) === id
      || (post.url && String(post.url).replace(/\.html$/, '') === id)
    ));
    if (index < 0) {
      renderNotFound();
      return;
    }

    const post = sorted[index];
    setPostMeta(post);
    const article = el('article', 'blog-post');
    const postHeader = el('header', 'post-head');
    const time = el('time', null, formatDate(post.date));
    time.dateTime = String(post.date || '');
    postHeader.append(time, el('h1', null, String(post.title || '(제목 없음)')));

    if (post.author || (post.updated && post.updated !== post.date)) {
      const meta = el('div', 'post-meta');
      if (post.author) meta.append(el('span', null, String(post.author)));
      if (post.updated && post.updated !== post.date) meta.append(el('span', null, `수정 ${formatDate(post.updated)}`));
      postHeader.append(meta);
    }

    if (Array.isArray(post.tags) && post.tags.length) {
      const tags = el('div', 'blog-tags');
      post.tags.forEach((tag) => tags.append(el('span', 'blog-tag', String(tag))));
      postHeader.append(tags);
    }

    article.append(postHeader, el('hr', 'post-rule'), renderBody(post.body));
    const faq = Array.isArray(post.faq) ? post.faq.filter((item) => item && item.q && item.a) : [];
    if (faq.length) article.append(renderFaq(faq));
    if (Array.isArray(post.sources) && post.sources.length) article.append(renderSources(post.sources));

    const previous = sorted[index + 1];
    const next = sorted[index - 1];
    if (previous || next) {
      const pagination = el('nav', 'blog-pn');
      pagination.setAttribute('aria-label', '이전 글과 다음 글');
      const appendCell = (item, className, label) => {
        if (!item) {
          pagination.append(el('span'));
          return;
        }
        const link = el('a', className);
        link.href = hrefOf(item);
        link.append(el('div', 'blog-pn-dir', label), el('div', 'blog-pn-title', String(item.title || '')));
        pagination.append(link);
      };
      appendCell(previous, 'prev', '이전 글');
      appendCell(next, 'next', '다음 글');
      article.append(pagination);
    }

    postMain.replaceChildren(article);
    postMain.setAttribute('aria-busy', 'false');
  };

  if (document.body.dataset.blogPage === 'list') {
    loadPosts().then(renderList).catch(renderListError);
  }

  if (document.body.dataset.blogPage === 'post') {
    loadPosts().then(renderPost).catch(renderNotFound);
  }
}());
