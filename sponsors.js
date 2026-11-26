(() => {
  const api = window.DropZoneFirebase;
  const featuredRoot = document.getElementById('featured-partner-content');
  const sponsorsRoot = document.getElementById('sponsor-grid');
  const defaultPartnerName = 'უცხო ენების უმაღლესი სკოლა ნინო';
  const languageKey = 'dz-language';
  const supportedLanguages = ['ka', 'en', 'ru'];
  const copy = {
    ka: {
      title: 'სპონსორები | DropZone Market',
      pageKicker: 'ადგილობრივი ნიჭის მხარდაჭერა',
      introEyebrow: 'ერთად ვუჭერთ მხარს შემოქმედებას',
      titlePrefix: 'ჩვენი',
      titleSuffix: 'პარტნიორები.',
      introDescription: 'პარტნიორები გვეხმარებიან ადგილობრივი ხელოვანებისა და მცირე ბიზნესის განვითარებაში.',
      featuredEyebrow: 'მთავარი პარტნიორი',
      defaultPartnerName,
      thanks: 'მადლობა მხარდაჭერისა და პარტნიორობისთვის.',
      learnMore: 'გაიგე მეტი',
      directoryTitle: 'სპონსორები',
      loading: 'სპონსორები იტვირთება…',
      empty: 'სხვა აქტიური სპონსორები მალე დაემატება.',
      missingFirebase: 'სპონსორების მონაცემები ვერ ჩაიტვირთა: Firebase-ის კონფიგურაცია აკლია.',
      unavailable: 'სპონსორების სია დროებით მიუწვდომელია.',
      partner: 'პარტნიორი',
      website: 'ვებგვერდი',
      views: 'ნახვა',
      pageKickerLabel: 'DROPZONE / პარტნიორები',
      communityLabel: 'DROPZONE / საზოგადოება',
      dialogTitle: 'შპს „უცხო ენების უმაღლესი სკოლა ნინო“',
      dialogIntro: 'მოხარული ვართ, რომ Dropzone-ის მთავარი პარტნიორი და მხარდამჭერია სკოლა „ნინო“ — 1992 წელს დაარსებული პირველი კერძო სკოლა საქართველოში, რომელიც მრავალი წელია ქმნის ხარისხიან საგანმანათლებლო გარემოს და უჭერს მხარს ახალგაზრდების განვითარებას.',
      detailLabels: ['სტატუსი / კატეგორია', 'სოციალური აქტივობა', 'შეფასება', 'მისამართი', 'ტელეფონი', 'ელფოსტა', 'დამატებითი ინფორმაცია'],
      statusDetail: 'Page · Middle School (1992 წლიდან — პირველი კერძო სკოლა საქართველოში)',
      socialDetail: '14K გამომწერი · 16 გამოწერილი',
      ratingDetail: '88% რეკომენდაცია (33 შეფასება)',
      additionalDetail: 'ფასის დიაპაზონი: $$ · ამჟამად დაკეტილია',
      facebookPage: 'Facebook გვერდი',
      logoAlt: 'უცხო ენების უმაღლესი სკოლა „ნინო“ — ლოგო',
      ticker: 'DropZone-ს მხარს უჭერს უცხო ენების უმაღლესი სკოლა „ნინო“.'
    },
    en: {
      title: 'Sponsors | DropZone Market',
      pageKicker: 'Supporting local talent',
      introEyebrow: 'Supporting creativity together',
      titlePrefix: 'Our',
      titleSuffix: 'Partners.',
      introDescription: 'Our partners help local artists and small businesses grow.',
      featuredEyebrow: 'Main partner',
      defaultPartnerName: 'Nino Higher School of Foreign Languages',
      thanks: 'Thank you for your support and partnership.',
      learnMore: 'Learn more',
      directoryTitle: 'Sponsors',
      loading: 'Loading sponsors…',
      empty: 'More active sponsors will be added soon.',
      missingFirebase: 'Sponsor data could not be loaded: Firebase configuration is missing.',
      unavailable: 'The sponsor list is temporarily unavailable.',
      partner: 'Partner',
      website: 'Website',
      views: 'views',
      pageKickerLabel: 'DROPZONE / PARTNERS',
      communityLabel: 'DROPZONE / COMMUNITY',
      dialogTitle: 'Nino Higher School of Foreign Languages LLC',
      dialogIntro: 'We are delighted that Nino School, founded in 1992 as Georgia’s first private school, is DropZone’s main partner and supporter. For many years, it has created a high-quality educational environment and supported young people’s development.',
      detailLabels: ['Status / category', 'Social activity', 'Rating', 'Address', 'Phone', 'Email', 'Additional information'],
      statusDetail: 'Page · Middle School (Georgia’s first private school, founded in 1992)',
      socialDetail: '14K followers · 16 following',
      ratingDetail: '88% recommend (33 reviews)',
      additionalDetail: 'Price range: $$ · Currently closed',
      facebookPage: 'Facebook page',
      logoAlt: 'Nino Higher School of Foreign Languages — logo',
      ticker: 'DropZone is supported by Nino Higher School of Foreign Languages.'
    },
    ru: {
      title: 'Спонсоры | DropZone Market',
      pageKicker: 'Поддержка местных талантов',
      introEyebrow: 'Вместе поддерживаем творчество',
      titlePrefix: 'Наши',
      titleSuffix: 'Партнёры.',
      introDescription: 'Наши партнёры помогают местным художникам и малому бизнесу развиваться.',
      featuredEyebrow: 'Главный партнёр',
      defaultPartnerName: 'Высшая школа иностранных языков «Нино»',
      thanks: 'Спасибо за поддержку и сотрудничество.',
      learnMore: 'Подробнее',
      directoryTitle: 'Спонсоры',
      loading: 'Загрузка спонсоров…',
      empty: 'Скоро появятся новые активные спонсоры.',
      missingFirebase: 'Не удалось загрузить данные спонсоров: отсутствует конфигурация Firebase.',
      unavailable: 'Список спонсоров временно недоступен.',
      partner: 'Партнёр',
      website: 'Веб-сайт',
      views: 'просмотров',
      pageKickerLabel: 'DROPZONE / ПАРТНЁРЫ',
      communityLabel: 'DROPZONE / СООБЩЕСТВО',
      dialogTitle: 'ООО «Высшая школа иностранных языков Нино»',
      dialogIntro: 'Мы рады, что школа «Нино», основанная в 1992 году как первая частная школа Грузии, является главным партнёром и сторонником DropZone. Уже много лет школа создаёт качественную образовательную среду и поддерживает развитие молодёжи.',
      detailLabels: ['Статус / категория', 'Активность в соцсетях', 'Рейтинг', 'Адрес', 'Телефон', 'Электронная почта', 'Дополнительная информация'],
      statusDetail: 'Страница · Средняя школа (первая частная школа Грузии, основана в 1992 году)',
      socialDetail: '14 тыс. подписчиков · 16 подписок',
      ratingDetail: 'Рекомендуют 88% (33 отзыва)',
      additionalDetail: 'Ценовой диапазон: $$ · Сейчас закрыто',
      facebookPage: 'Страница Facebook',
      logoAlt: 'Высшая школа иностранных языков «Нино» — логотип',
      ticker: 'DropZone поддерживает Высшая школа иностранных языков «Нино».'
    }
  };
  const headerCopy = {
    ka: {
      nav: ['მთავარი', 'ბრენდები', 'სპონსორები', 'ჩვენ შესახებ', 'კონტაქტი', 'განათავსე ნივთი'],
      notifications: 'შეტყობინებები', favorites: 'ფავორიტები', cart: 'კალათა',
      language: 'ენის არჩევა', account: 'შესვლა / რეგისტრაცია', balance: 'ბალანსი:',
      brand: 'DropZone მთავარი', statsLabel: 'DropZone-ის სტატისტიკა',
      openMenu: 'მენიუს გახსნა', closeMenu: 'მენიუს დახურვა',
      footerBrand: 'ადგილობრივი შემოქმედება,<br>რომელსაც საკუთარი ისტორია აქვს.',
      stats: ['აქტიური ხელოვანი', 'უსაფრთხო გარანტია', 'დღიანი მიწოდება'],
      discover: 'აღმოაჩინე', information: 'ინფორმაცია', follow: 'გამოგვყევი',
      home: 'მთავარი', about: 'ჩვენ შესახებ', sponsors: 'სპონსორები', contact: 'კონტაქტი',
      upload: 'ნამუშევრის დამატება', terms: 'წესები და პირობები',
      refund: 'დაბრუნება და დავები', privacy: 'კონფიდენციალურობა',
      footerNote: 'შექმნილია ადგილობრივი ხელოვანებისა და მცირე ბიზნესისთვის.',
      top: 'გვერდის დასაწყისში'
    },
    en: {
      nav: ['Home', 'Brands', 'Sponsors', 'About us', 'Contact', 'List an item'],
      notifications: 'Notifications', favorites: 'Favorites', cart: 'Cart',
      language: 'Choose language', account: 'Sign in / Register', balance: 'Balance:',
      brand: 'DropZone home', statsLabel: 'DropZone statistics',
      openMenu: 'Open menu', closeMenu: 'Close menu',
      footerBrand: 'Local creativity,<br>with a story of its own.',
      stats: ['Active creators', 'Secure guarantee', 'Days delivery'],
      discover: 'Discover', information: 'Information', follow: 'Follow us',
      home: 'Home', about: 'About us', sponsors: 'Sponsors', contact: 'Contact',
      upload: 'List an item', terms: 'Terms and conditions',
      refund: 'Returns and disputes', privacy: 'Privacy',
      footerNote: 'Made for local artists and small businesses.',
      top: 'Back to top'
    },
    ru: {
      nav: ['Главная', 'Бренды', 'Спонсоры', 'О нас', 'Контакты', 'Разместить товар'],
      notifications: 'Уведомления', favorites: 'Избранное', cart: 'Корзина',
      language: 'Выбрать язык', account: 'Войти / Регистрация', balance: 'Баланс:',
      brand: 'DropZone — главная', statsLabel: 'Статистика DropZone',
      openMenu: 'Открыть меню', closeMenu: 'Закрыть меню',
      footerBrand: 'Местное творчество,<br>со своей историей.',
      stats: ['Активные авторы', 'Гарантия безопасности', 'Дней доставка'],
      discover: 'Откройте', information: 'Информация', follow: 'Мы в соцсетях',
      home: 'Главная', about: 'О нас', sponsors: 'Спонсоры', contact: 'Контакты',
      upload: 'Добавить работу', terms: 'Условия использования',
      refund: 'Возврат и споры', privacy: 'Конфиденциальность',
      footerNote: 'Создано для местных авторов и малого бизнеса.',
      top: 'Наверх'
    }
  };
  let language = readLanguage();
  let tickerOverride = '';
  let partner = {
    partnerName: defaultPartnerName,
    partnerDescription: '',
    partnerWebsiteUrl: '',
    partnerLogoUrl: ''
  };
  let sponsors = [];
  let sponsorsLoaded = false;
  let sponsorLoadFailed = false;
  let firebaseMissing = false;

  function readLanguage() {
    try {
      const savedLanguage = JSON.parse(localStorage.getItem(languageKey) || 'null');
      return supportedLanguages.includes(savedLanguage) ? savedLanguage : 'ka';
    } catch (error) {
      console.error('Unable to read the saved language preference.', error);
      return 'ka';
    }
  }

  function setLanguage(nextLanguage, persist = true) {
    if (!supportedLanguages.includes(nextLanguage)) return;
    language = nextLanguage;
    if (persist) {
      try {
        localStorage.setItem(languageKey, JSON.stringify(language));
      } catch (error) {
        console.error('Unable to save the language preference.', error);
      }
    }
    applyLanguage();
  }

  function applySharedLanguage() {
    const text = headerCopy[language];
    document.documentElement.lang = language;
    document.querySelectorAll('.main-nav [data-nav]').forEach((link, index) => {
      link.textContent = text.nav[index] || link.textContent;
    });
    const setLabel = (selector, label) => {
      const element = document.querySelector(selector);
      if (element) element.setAttribute('aria-label', label);
    };
    setLabel('.main-nav', language === 'ka' ? 'მთავარი ნავიგაცია' : language === 'en' ? 'Main navigation' : 'Основная навигация');
    setLabel('.ticker', language === 'ka' ? 'პარტნიორის სიახლე' : language === 'en' ? 'Partner update' : 'Новости партнёра');
    setLabel('.language-options', text.language);
    document.querySelectorAll('.brand').forEach(brand => brand.setAttribute('aria-label', text.brand));
    setLabel('.shared-footer-stats', text.statsLabel);
    setLabel('[data-notifications-open]', text.notifications);
    setLabel('#favorites-toggle', text.favorites);
    setLabel('#cart-open', text.cart);
    setLabel('#auth-open', text.account);
    setLabel('[data-open-balance]', text.balance);

    const accountLabel = document.querySelector('#auth-open .account-label');
    if (accountLabel) accountLabel.textContent = text.account;
    const balanceLabel = document.getElementById('balance-label');
    if (balanceLabel) {
      let storedBalance = 0;
      try {
        storedBalance = JSON.parse(localStorage.getItem('dz-balance') || '0');
      } catch (error) {
        console.error('Unable to read the saved balance for the header.', error);
      }
      const amount = Number.isFinite(Number(storedBalance)) ? Number(storedBalance) : 0;
      const formattedAmount = amount.toLocaleString(language === 'ka' ? 'ka-GE' : language === 'ru' ? 'ru-RU' : 'en-US');
      const label = `${text.balance} ${formattedAmount} ${language === 'en' ? 'GEL' : '₾'}`;
      balanceLabel.textContent = label;
      setLabel('[data-open-balance]', label);
    }
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.setAttribute('aria-label', menuToggle.getAttribute('aria-expanded') === 'true' ? text.closeMenu : text.openMenu);
    }

    const footerBrand = document.querySelector('.shared-footer-brand > p');
    if (footerBrand) footerBrand.innerHTML = text.footerBrand;
    document.querySelectorAll('.shared-footer-stats div span').forEach((span, index) => {
      span.textContent = text.stats[index] || span.textContent;
    });
    const footerGroups = document.querySelectorAll('.footer-links');
    const footerLinkText = [
      [text.home, text.about, text.sponsors, text.contact, text.upload],
      [text.terms, text.refund, text.privacy]
    ];
    footerGroups.forEach((group, groupIndex) => {
      const heading = group.querySelector('strong');
      if (heading) heading.textContent = groupIndex === 0 ? text.discover : text.information;
      group.querySelectorAll('a').forEach((link, linkIndex) => {
        link.textContent = footerLinkText[groupIndex]?.[linkIndex] || link.textContent;
      });
    });
    const socialHeading = document.querySelector('.social-links > strong');
    if (socialHeading) socialHeading.textContent = text.follow;
    const socialLinks = document.querySelectorAll('.social-links a');
    ['Instagram', 'Facebook'].forEach((label, index) => {
      if (socialLinks[index]) {
        socialLinks[index].firstChild.nodeValue = language === 'ru'
          ? ['Инстаграм', 'Фейсбук'][index]
          : language === 'en' ? label : ['ინსტაგრამი', 'ფეისბუქი'][index];
      }
    });
    const footerNote = document.querySelector('.footer-bottom span:nth-child(2)');
    if (footerNote) footerNote.textContent = text.footerNote;
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) backToTop.setAttribute('aria-label', text.top);
  }

  function applyLanguage() {
    const text = copy[language];
    document.title = text.title;
    document.querySelectorAll('[data-sponsors-copy]').forEach(element => {
      const value = text[element.dataset.sponsorsCopy];
      if (value) element.textContent = value;
    });
    const prefix = document.querySelector('[data-sponsors-copy="titlePrefix"]');
    const suffix = document.querySelector('[data-sponsors-copy="titleSuffix"]');
    if (prefix) prefix.textContent = text.titlePrefix;
    if (suffix) suffix.textContent = text.titleSuffix;
    const pageKicker = document.querySelector('.page-kicker > span:first-child');
    if (pageKicker) pageKicker.textContent = text.pageKickerLabel;
    const communityLabel = document.querySelector('.sponsor-directory .eyebrow');
    if (communityLabel) communityLabel.textContent = text.communityLabel;
    document.querySelectorAll('.partner-banner-badge').forEach(partnerBadge => {
      partnerBadge.textContent = text.featuredEyebrow;
    });
    const partnerTitle = document.getElementById('partner-banner-title');
    if (partnerTitle) partnerTitle.textContent = text.defaultPartnerName;
    const partnerDescription = document.getElementById('partner-banner-description');
    if (partnerDescription) partnerDescription.textContent = text.thanks;
    const partnerCta = document.querySelector('.partner-banner-cta');
    if (partnerCta?.firstChild) partnerCta.firstChild.nodeValue = `${text.learnMore} `;
    const modalTitle = document.getElementById('partner-modal-title');
    if (modalTitle) modalTitle.textContent = text.dialogTitle;
    const modalIntro = document.querySelector('.partner-modal-intro');
    if (modalIntro) modalIntro.textContent = text.dialogIntro;
    document.querySelectorAll('.partner-modal-details dt').forEach((label, index) => {
      label.textContent = text.detailLabels[index] || label.textContent;
    });
    const details = document.querySelectorAll('.partner-modal-details dd');
    if (details[0]) details[0].textContent = text.statusDetail;
    if (details[1]) details[1].textContent = text.socialDetail;
    if (details[2]) details[2].textContent = text.ratingDetail;
    if (details[3] && language !== 'ka') details[3].textContent = 'Varketili, Upper Plateau, Block 2, Building 11a, near Georgian Unity Fighters Street, Tbilisi, Georgia';
    if (details[6]) details[6].textContent = text.additionalDetail;
    const facebookLink = document.querySelector('.partner-modal-link[href*="facebook.com"]');
    if (facebookLink?.firstChild) facebookLink.firstChild.nodeValue = `${text.facebookPage} `;
    document.querySelectorAll('.partner-modal-close-icon, .partner-modal-dismiss').forEach(button => {
      const closeLabel = language === 'ka' ? 'დახურვა' : language === 'en' ? 'Close' : 'Закрыть';
      button.setAttribute('aria-label', closeLabel);
      if (button.classList.contains('partner-modal-dismiss')) button.textContent = closeLabel;
    });
    const websiteLink = document.getElementById('partner-website-link');
    if (websiteLink?.firstChild) websiteLink.firstChild.nodeValue = `${text.learnMore} `;
    document.querySelectorAll('.partner-banner-logo,.partner-modal-logo-frame img').forEach(image => {
      image.alt = text.logoAlt;
    });
    document.querySelectorAll('[data-language]').forEach(button => {
      button.classList.toggle('is-active', button.dataset.language === language);
    });
    applySharedLanguage();
    renderTicker();
    render();
  }

  function renderTicker() {
    const ticker = document.getElementById('ticker-track') || document.getElementById('sponsor-ticker-track');
    if (!ticker) return;
    const message = tickerOverride || copy[language].ticker;
    ticker.innerHTML = `<span>${escapeHTML(message)}</span><span>${escapeHTML(message)}</span>`;
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function safeLink(value) {
    try {
      const url = new URL(String(value || ''));
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function featuredSponsor() {
    return sponsors.find(item => item.name === partner.partnerName)
      || sponsors.find(item => item.name === defaultPartnerName);
  }

  function renderFeatured() {
    if (!featuredRoot) return;
    const sponsor = featuredSponsor();
    const rawName = sponsor?.name || partner.partnerName || defaultPartnerName;
    const name = rawName === defaultPartnerName ? copy[language].defaultPartnerName : rawName;
    const description = partner.partnerDescription || sponsor?.description || copy[language].thanks;
    const logoUrl = partner.partnerLogoUrl || sponsor?.logoUrl || 'assets/nino-school-logo.png';
    const websiteUrl = safeLink(partner.partnerWebsiteUrl || sponsor?.websiteUrl);
    const image = logoUrl
      ? `<img class="featured-partner-logo" src="${escapeHTML(logoUrl)}" alt="${escapeHTML(name)}">`
      : '';
    const title = `<h2 id="featured-partner-title">${escapeHTML(name)}</h2>`;
    const content = `<div class="featured-partner-content">${image}<div>${title}<p>${escapeHTML(description)}</p>${websiteUrl ? `<a class="button button-primary sponsor-visit" href="${escapeHTML(websiteUrl)}" target="_blank" rel="noopener noreferrer" ${sponsor ? `data-sponsor-click="${escapeHTML(sponsor.id)}"` : ''}>${copy[language].learnMore} <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>` : ''}</div></div>`;
    featuredRoot.innerHTML = content;
  }

  function renderSponsors() {
    if (firebaseMissing) {
      sponsorsRoot.innerHTML = `<p class="demo-note">${copy[language].missingFirebase}</p>`;
      return;
    }
    if (sponsorLoadFailed) {
      sponsorsRoot.innerHTML = `<p class="demo-note">${copy[language].unavailable}</p>`;
      return;
    }
    if (!sponsorsLoaded) {
      sponsorsRoot.innerHTML = `<p class="demo-note">${copy[language].loading}</p>`;
      return;
    }
    const otherSponsors = sponsors.filter(item => item.active === true && item.id !== featuredSponsor()?.id);
    sponsorsRoot.innerHTML = otherSponsors.length ? otherSponsors.map(item => {
      const url = safeLink(item.websiteUrl);
      const media = item.logoUrl
        ? `<img src="${escapeHTML(item.logoUrl)}" alt="${escapeHTML(item.name)}" loading="lazy">`
        : `<span class="sponsor-placeholder" aria-hidden="true">${escapeHTML(String(item.name || 'D').slice(0, 1).toUpperCase())}</span>`;
      return `<article class="sponsor-card">
        <div class="sponsor-card-mark">${media}<span class="sponsor-tier">${escapeHTML(item.tier || copy[language].partner)}</span></div>
        <div class="sponsor-card-copy"><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.description || '')}</p>
        <div class="sponsor-card-footer">${url ? `<a class="text-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" data-sponsor-click="${escapeHTML(item.id)}">${copy[language].website} <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>` : `<span class="sponsor-clicks">${copy[language].partner}</span>`}<span class="sponsor-clicks">${Number(item.clicks || 0).toLocaleString(language === 'ka' ? 'ka-GE' : language === 'ru' ? 'ru-RU' : 'en-US')} ${copy[language].views}</span></div></div>
      </article>`;
    }).join('') : `<p class="demo-note">${copy[language].empty}</p>`;
  }

  function render() {
    renderFeatured();
    renderSponsors();
  }

  document.addEventListener('click', event => {
    const languageButton = event.target.closest('[data-language]');
    if (languageButton) {
      setLanguage(languageButton.dataset.language);
      return;
    }
    if (event.target.closest('#menu-toggle')) {
      applySharedLanguage();
      return;
    }
    const link = event.target.closest('[data-sponsor-click]');
    if (link && api) {
      api.trackSponsorClick(link.dataset.sponsorClick).catch(error => {
        console.error('Unable to count sponsor click.', error);
      });
    }
  });
  window.addEventListener('storage', event => {
    if (event.key !== languageKey) return;
    let nextLanguage = 'ka';
    try {
      const savedLanguage = JSON.parse(event.newValue || 'null');
      if (supportedLanguages.includes(savedLanguage)) nextLanguage = savedLanguage;
    } catch (error) {
      console.error('Unable to apply a changed language preference.', error);
    }
    setLanguage(nextLanguage, false);
  });

  applyLanguage();

  if (!api) {
    firebaseMissing = true;
    renderSponsors();
    return;
  }

  api.subscribeSiteConfig(config => {
    partner = {
      partnerName: String(config.partnerName || defaultPartnerName),
      partnerDescription: String(config.partnerDescription || ''),
      partnerWebsiteUrl: String(config.partnerWebsiteUrl || ''),
      partnerLogoUrl: String(config.partnerLogoUrl || '')
    };
    tickerOverride = String(config.tickerMessage || '');
    renderTicker();
    render();
  }, error => {
    console.error('Unable to load public partner configuration.', error);
  });

  api.subscribeSponsors(items => {
    sponsors = items.filter(item => item.active === true);
    sponsorsLoaded = true;
    render();
  }, error => {
    console.error('Unable to load active sponsors.', error);
    sponsorLoadFailed = true;
    sponsorsRoot.innerHTML = `<p class="demo-note">${copy[language].unavailable}</p>`;
  });
})();
