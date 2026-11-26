(() => {
  const script = document.currentScript;
  if (!script) throw new Error('Shared layout script context is unavailable.');

  const root = new URL('.', script.src);
  const href = path => new URL(path, root).href;
  const pagePath = new URL(location.href).pathname.toLowerCase();
  const activePage = pagePath.endsWith('/sponsors.html') ? 'sponsors'
    : pagePath.endsWith('/about/index.html') ? 'about'
      : pagePath.endsWith('/contact/index.html') ? 'upload'
        : pagePath.endsWith('/contact.html') ? 'contact'
          : pagePath.endsWith('/admin.html') ? 'admin'
            : pagePath.endsWith('/terms.html') || pagePath.endsWith('/refund-policy.html') ? 'legal'
              : 'home';
  const nav = [
    ['home', 'მთავარი', 'index.html'],
    ['brands', 'ბრენდები', 'index.html#brands'],
    ['sponsors', 'სპონსორები', 'sponsors.html'],
    ['about', 'ჩვენ შესახებ', 'about/index.html'],
    ['contact', 'კონტაქტი', 'contact.html'],
    ['upload', 'განათავსე ნივთი', 'contact/index.html']
  ];
  const navLinks = nav.map(([key, label, path]) => {
    const active = activePage === key;
    return `<a href="${href(path)}" data-nav="${key}"${active ? ' class="active" aria-current="page"' : ''}>${label}</a>`;
  }).join('');
  const brandMark = `<img class="brand-mark" src="${href('assets/dropzone-brand-round.png')}" alt="">`;
  const languageButton = (language, label, flag) => `<button class="language-option" type="button" data-language="${language}" aria-label="${label}" aria-pressed="false" title="${label}">${flag}</button>`;
  const bolnisiCross = 'M-1.5 -4.5H1.5V-2.5C1.5 -1.5 2 -1.5 2.5 -1.5H4.5V1.5H2.5C2 1.5 1.5 1.5 1.5 2.5V4.5H-1.5V2.5C-1.5 1.5 -2 1.5 -2.5 1.5H-4.5V-1.5H-2.5C-2 -1.5 -1.5 -1.5 -1.5 -2.5Z';
  const georgianFlag = `<svg class="language-flag language-flag--georgia" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" fill="#fff"/><path d="M16 0h8v16h16v8H24v16h-8V24H0v-8h16z" fill="#f00"/><path d="${bolnisiCross}" transform="translate(9 9) scale(.5)" fill="#f00"/><path d="${bolnisiCross}" transform="translate(31 9) scale(.5)" fill="#f00"/><path d="${bolnisiCross}" transform="translate(9 31) scale(.5)" fill="#f00"/><path d="${bolnisiCross}" transform="translate(31 31) scale(.5)" fill="#f00"/></svg>`;
  const languageLabels = { ka: 'GEO — ქართული', en: 'ENG — English', ru: 'RUS — Русский' };
  const languageFlags = {
    ka: georgianFlag,
    en: '<svg class="language-flag" viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect width="60" height="40" fill="#012169"/><path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="9"/><path d="M0 0 60 40M60 0 0 40" stroke="#c8102e" stroke-width="4"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="13"/><path d="M30 0v40M0 20h60" stroke="#c8102e" stroke-width="7"/></svg>',
    ru: '<svg class="language-flag" viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect width="60" height="13.34" fill="#fff"/><rect y="13.33" width="60" height="13.34" fill="#0039a6"/><rect y="26.66" width="60" height="13.34" fill="#d52b1e"/></svg>'
  };
  const languageOptions = Object.keys(languageFlags)
    .map(language => languageButton(language, languageLabels[language], languageFlags[language]))
    .join('');
  const languagePicker = variant => `<div class="language-switcher language-switcher--${variant}">
    <button class="language-trigger is-active" type="button" data-language-trigger aria-controls="language-options-${variant}" aria-expanded="false" aria-label="ენის არჩევა">${languageFlags.ka}</button>
    <div class="language-options" id="language-options-${variant}" role="group" aria-label="ენის არჩევა" aria-hidden="true">${languageOptions}</div>
  </div>`;
  const header = `<div class="shared-header">
    <div class="ticker" aria-label="პარტნიორის სიახლე"><div class="ticker-track" id="ticker-track"><span>DropZone-ს მხარს უჭერს უცხო ენების უმაღლესი სკოლა „ნინო“.</span><span>DropZone-ს მხარს უჭერს უცხო ენების უმაღლესი სკოლა „ნინო“.</span></div></div>
    <header class="site-header">
      <a class="brand" href="${href('index.html')}" aria-label="DropZone მთავარი"><span class="brand-icon">${brandMark}</span><span class="brand-name">DropZone</span></a>
      <nav class="main-nav" id="primary-navigation" aria-label="მთავარი ნავიგაცია">${navLinks}${languagePicker('mobile')}</nav>
      <div class="header-actions">
        <button class="icon-action" type="button" aria-label="შეტყობინებები" data-notifications-open data-shared-action="notifications"><svg class="notification-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-2 7-2 9h16c0-2-2-2-2-9"/><path d="M10 21h4"/></svg><span class="notification-count" data-notification-count hidden>0</span></button>
        <button class="icon-action" id="favorites-toggle" type="button" aria-label="ფავორიტები" data-shared-action="favorites"><svg class="header-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.6c0 5-8.8 10.1-8.8 10.1S3.2 13.6 3.2 8.6a4.6 4.6 0 0 1 8.8-2.8 4.6 4.6 0 0 1 8.8 2.8Z"/></svg><span id="favorite-count">0</span></button>
        <button class="icon-action" id="cart-open" type="button" aria-label="კალათა" data-shared-action="cart"><svg class="cart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 4.5h2l2.2 10.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L22 8H6"/><circle cx="10.5" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg><span id="cart-count">0</span></button>
        ${languagePicker('desktop')}
        <button class="account-button" id="auth-open" type="button" aria-label="შესვლა / რეგისტრაცია" data-shared-action="login"><span class="account-label" data-i18n="შესვლა / რეგისტრაცია">შესვლა / რეგისტრაცია</span><svg class="account-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 19c.8-3.7 3-5.5 6.5-5.5s5.7 1.8 6.5 5.5"/></svg></button>
        <button class="balance-button" data-open-balance type="button" aria-label="ბალანსი" data-shared-action="balance"><span class="balance-dot"></span><span id="balance-label">ბალანსი: 0 ₾</span><span class="balance-plus" aria-hidden="true"><svg class="header-icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span></button>
        <button class="admin-logout-button" id="admin-logout" type="button" hidden>გამოსვლა</button>
      </div>
      <button class="menu-toggle" id="menu-toggle" type="button" aria-label="მენიუს გახსნა" aria-controls="primary-navigation" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="menu-line menu-line--top" d="M4 6h16"/><path class="menu-line menu-line--middle" d="M4 12h16"/><path class="menu-line menu-line--bottom" d="M4 18h16"/></svg></button>
    </header>
  </div>`;
  const footer = `<footer class="site-footer">
    <div class="footer-divider shell" aria-hidden="true"></div>
    <div class="footer-main shell">
      <div class="shared-footer-brand"><a class="brand" href="${href('index.html')}" aria-label="DropZone მთავარი"><span class="brand-icon">${brandMark}</span><span class="brand-name">DropZone</span></a><p>ადგილობრივი შემოქმედება,<br>რომელსაც საკუთარი ისტორია აქვს.</p><div class="shared-footer-stats" aria-label="DropZone-ის სტატისტიკა"><div><strong id="hero-artist-count">00+</strong><span>აქტიური ხელოვანი</span></div><div><strong>100%</strong><span>უსაფრთხო გარანტია</span></div><div><strong>3–5</strong><span>დღიანი მიწოდება</span></div></div></div>
      <div class="footer-links"><strong>აღმოაჩინე</strong><a href="${href('index.html')}">მთავარი</a><a href="${href('about/index.html')}">ჩვენ შესახებ</a><a href="${href('sponsors.html')}">სპონსორები</a><a href="${href('contact.html')}">კონტაქტი</a><a href="${href('contact/index.html')}">ნამუშევრის დამატება</a></div>
      <div class="footer-links"><strong>ინფორმაცია</strong><a href="${href('terms.html')}">წესები და პირობები</a><a href="${href('refund-policy.html')}">დაბრუნება და დავები</a><a href="${href('index.html?open=privacy')}">კონფიდენციალურობა</a></div>
      <div class="social-links"><strong>გამოგვყევი</strong><a href="https://www.instagram.com/dropzone_122?jplx=MTVkd3Nmb3drMnV3Zg%3D%3D&amp;utm_source=qr" target="_blank" rel="noopener noreferrer">Instagram <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a></div>
    </div>
    <div class="footer-bottom shell"><span>© 2026 DropZone Market</span><span>შექმნილია ადგილობრივი ხელოვანებისა და მცირე ბიზნესისთვის.</span><a class="back-to-top" href="#top" aria-label="გვერდის დასაწყისში"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></a></div>
  </footer>`;

  const headerHolder = document.createElement('template');
  headerHolder.innerHTML = header;
  const headerNode = headerHolder.content.firstElementChild;
  const headerPlaceholder = document.getElementById('shared-header');
  const oldTicker = document.querySelector('.ticker');
  const oldHeader = document.querySelector('header.site-header');
  if (headerPlaceholder) headerPlaceholder.replaceWith(headerNode);
  else if (oldTicker) oldTicker.replaceWith(headerNode);
  else if (oldHeader) oldHeader.before(headerNode);
  else document.body.prepend(headerNode);
  document.querySelectorAll('.ticker, header.site-header').forEach(node => {
    if (!node.closest('.shared-header')) node.remove();
  });

  const footerHolder = document.createElement('template');
  footerHolder.innerHTML = footer;
  const footerNode = footerHolder.content.firstElementChild;
  const footerPlaceholder = document.getElementById('shared-footer');
  const oldFooter = document.querySelector('footer.site-footer');
  if (footerPlaceholder) footerPlaceholder.replaceWith(footerNode);
  else if (oldFooter) oldFooter.replaceWith(footerNode);
  else {
    const modalRoot = document.getElementById('modal-root');
    document.body.insertBefore(footerNode, modalRoot || null);
  }
  document.querySelectorAll('.legal-footer').forEach(node => node.remove());
  document.body.id ||= 'top';

  const hasApp = Array.from(document.scripts).some(item => /(?:^|\/)app\.js(?:[?#]|$)/.test(item.src));
  const savedLanguage = (() => {
    try {
      const value = JSON.parse(localStorage.getItem('dz-language') || '"ka"');
      return ['ka', 'en', 'ru'].includes(value) ? value : 'ka';
    } catch (error) {
      console.error('Unable to read the saved language preference.', error);
      return 'ka';
    }
  })();
  const sharedLanguageCopy = {
    ka: { nav: ['მთავარი', 'ბრენდები', 'სპონსორები', 'ჩვენ შესახებ', 'კონტაქტი', 'განათავსე ნივთი'], notifications: 'შეტყობინებები', favorites: 'ფავორიტები', cart: 'კალათა', account: 'შესვლა / რეგისტრაცია', balance: 'ბალანსი:', language: 'ენის არჩევა', brand: 'DropZone მთავარი', statsLabel: 'DropZone-ის სტატისტიკა', tickerLabel: 'პარტნიორის სიახლე', ticker: 'DropZone-ს მხარს უჭერს უცხო ენების უმაღლესი სკოლა „ნინო“.', open: 'მენიუს გახსნა', close: 'მენიუს დახურვა', footer: 'ადგილობრივი შემოქმედება,<br>რომელსაც საკუთარი ისტორია აქვს.', active: 'აქტიური ხელოვანი', secure: 'უსაფრთხო გარანტია', delivery: 'დღიანი მიწოდება', discover: 'აღმოაჩინე', information: 'ინფორმაცია', follow: 'გამოგვყევი', terms: 'წესები და პირობები', refund: 'დაბრუნება და დავები', privacy: 'კონფიდენციალურობა', footerNote: 'შექმნილია ადგილობრივი ხელოვანებისა და მცირე ბიზნესისთვის.', top: 'გვერდის დასაწყისში' },
    en: { nav: ['Home', 'Brands', 'Sponsors', 'About us', 'Contact', 'List an item'], notifications: 'Notifications', favorites: 'Favorites', cart: 'Cart', account: 'Sign in / Register', balance: 'Balance:', language: 'Choose language', brand: 'DropZone home', statsLabel: 'DropZone statistics', tickerLabel: 'Partner update', ticker: 'DropZone is supported by Nino Higher School of Foreign Languages.', open: 'Open menu', close: 'Close menu', footer: 'Local creativity,<br>with a story of its own.', active: 'Active creators', secure: 'Secure guarantee', delivery: 'Days delivery', discover: 'Discover', information: 'Information', follow: 'Follow us', terms: 'Terms and conditions', refund: 'Returns and disputes', privacy: 'Privacy', footerNote: 'Made for local artists and small businesses.', top: 'Back to top' },
    ru: { nav: ['Главная', 'Бренды', 'Спонсоры', 'О нас', 'Контакты', 'Разместить товар'], notifications: 'Уведомления', favorites: 'Избранное', cart: 'Корзина', account: 'Войти / Регистрация', balance: 'Баланс:', language: 'Выбрать язык', brand: 'DropZone — главная', statsLabel: 'Статистика DropZone', tickerLabel: 'Новости партнёра', ticker: 'DropZone поддерживает Высшая школа иностранных языков «Нино».', open: 'Открыть меню', close: 'Закрыть меню', footer: 'Местное творчество,<br>со своей историей.', active: 'Активные авторы', secure: 'Гарантия безопасности', delivery: 'Дней доставка', discover: 'Откройте', information: 'Информация', follow: 'Мы в соцсетях', terms: 'Условия использования', refund: 'Возврат и споры', privacy: 'Конфиденциальность', footerNote: 'Создано для местных авторов и малого бизнеса.', top: 'Наверх' }
  };
  const pageTextTranslations = new Map([
    ['DROPZONE / MANAGEMENT', 'DROPZONE / MANAGEMENT', 'DROPZONE / УПРАВЛЕНИЕ'],
    ['მონაცემების ჩატვირთვა…', 'Loading data…', 'Загрузка данных…'],
    ['ადმინისტრატორის პანელი | DropZone Market', 'Administrator dashboard | DropZone Market', 'Панель администратора | DropZone Market'],
    ['ადმინისტრირება', 'Administration', 'Администрирование'],
    ['ადმინისტრატორის', 'Administrator', ' '],
    ['პანელი', 'dashboard', 'Панель администратора'],
    ['საერთო სერვერული მონაცემები PIN-ით არის დაცული. სერვერის კონფიგურაციის გარეშე პანელი აჩვენებს და ცვლის მხოლოდ ამ ბრაუზერის ლოკალურ პროდუქტებსა და შეკვეთებს; ეს მონაცემები სხვა მოწყობილობებთან არ სინქრონდება.', 'Shared server data is protected by a PIN. Without server configuration, the dashboard only displays and changes local products and orders in this browser; this data is not synchronized with other devices.', 'Общие серверные данные защищены PIN-кодом. Без настройки сервера панель показывает и изменяет только локальные товары и заказы в этом браузере; эти данные не синхронизируются с другими устройствами.'],
    ['ადმინისტრატორის PIN', 'Administrator PIN', 'PIN-код администратора'],
    ['PIN კოდი', 'PIN code', 'PIN-код'],
    ['გაგრძელება', 'Continue', 'Продолжить'],
    ['შესასვლელად შეიყვანე ადმინისტრატორის PIN.', 'Enter the administrator PIN to continue.', 'Введите PIN-код администратора, чтобы продолжить.'],
    ['მოლოდინში მყოფი პროდუქტები', 'Pending products', 'Товары на проверке'],
    ['გადახდები / ბალანსი', 'Payments / balance', 'Платежи / баланс'],
    ['ყველა პროდუქტი', 'All products', 'Все товары'],
    ['შეკვეთები / სტატუსები', 'Orders / statuses', 'Заказы / статусы'],
    ['ფინანსები / CSV', 'Finance / CSV', 'Финансы / CSV'],
    ['გამყიდველები / KYC', 'Sellers / KYC', 'Продавцы / KYC'],
    ['მომხმარებლები', 'Users', 'Пользователи'],
    ['სპონსორები', 'Sponsors', 'Спонсоры'],
    ['რეკლამები', 'Ads', 'Реклама'],
    ['რეპორტები', 'Reports', 'Жалобы'],
    ['საიტის ტექსტები', 'Site content', 'Тексты сайта'],
    ['დავები', 'Disputes', 'Споры'],
    ['კატეგორიები / ტეგები', 'Categories / tags', 'Категории / теги'],
    ['პრომო კოდები', 'Promo codes', 'Промокоды'],
    ['აქტივობის ჟურნალი', 'Activity log', 'Журнал активности'],
    ['გადახდები და ბალანსის მოთხოვნები', 'Payments and balance requests', 'Платежи и запросы на пополнение'],
    ['დადასტურებამდე გადაამოწმე ტრანზაქციის ნომერი და თანხა ბანკის ამონაწერში.', 'Before approving, verify the transaction ID and amount in the bank statement.', 'Перед подтверждением сверьте номер транзакции и сумму с выпиской банка.'],
    ['მყიდველთა შეკვეთები', 'Customer orders', 'Заказы покупателей'],
    ['Checkout ამჟამად სატესტო რეჟიმშია: რეალური თანხა არ ჩამოიჭრება. ჩაბარების შემდეგ Escrow/hold აღირიცხება 5 დღით.', 'Checkout is currently in test mode: no real money is charged. After delivery, escrow/hold is recorded for 5 days.', 'Оформление заказа работает в тестовом режиме: реальные деньги не списываются. После доставки эскроу/удержание учитывается в течение 5 дней.'],
    ['ტრანზაქციები და გადარიცხვები', 'Transactions and payouts', 'Транзакции и выплаты'],
    ['ეს არის ადმინისტრატორის აღრიცხვის ჟურნალი და არა გადახდის პროვაიდერი. ჩაწერა არ ადასტურებს თანხის რეალურ მიღებას ან გადარიცხვას. Escrow-ის ვადა ითვლება მიწოდების თარიღიდან 5 დღით; დავა ავტომატურად აჩერებს payout-ს.', 'This is an administrator ledger, not a payment provider. Recording an entry does not confirm that money was received or transferred. The escrow period is 5 days from delivery; a dispute automatically pauses the payout.', 'Это журнал учёта администратора, а не платёжный провайдер. Запись не подтверждает фактическое получение или перевод денег. Срок эскроу — 5 дней с даты доставки; спор автоматически приостанавливает выплату.'],
    ['თარიღიდან', 'From date', 'С даты'],
    ['თარიღამდე', 'To date', 'По дату'],
    ['CSV ჩამოტვირთვა', 'Download CSV', 'Скачать CSV'],
    ['ტიპი', 'Type', 'Тип'],
    ['პროდუქტის გაყიდვა', 'Product sale', 'Продажа товара'],
    ['თანხის დაბრუნება (აღრიცხვა)', 'Refund (record only)', 'Возврат (только учёт)'],
    ['მყიდველი', 'Buyer', 'Покупатель'],
    ['ხელოვანი / ID', 'Creator / ID', 'Автор / ID'],
    ['აღწერა / შეკვეთის ნომერი', 'Description / order number', 'Описание / номер заказа'],
    ['ჯამური თანხა (₾)', 'Total amount (GEL)', 'Общая сумма (₾)'],
    ['გადახდის მეთოდი', 'Payment method', 'Способ оплаты'],
    ['ბანკი / ბარათი', 'Bank / card', 'Банк / карта'],
    ['მიწოდების თარიღი', 'Delivery date', 'Дата доставки'],
    ['აღრიცხვაში დამატება', 'Add to ledger', 'Добавить в журнал'],
    ['ხელოვანთა payout-ები', 'Creator payouts', 'Выплаты авторам'],
    ['თანხა (₾)', 'Amount (GEL)', 'Сумма (₾)'],
    ['Payout მოთხოვნის დამატება', 'Add payout request', 'Добавить запрос на выплату'],
    ['გამყიდველის KYC და VIP', 'Seller KYC and VIP', 'KYC продавца и VIP'],
    ['პირადი ნომერი და IBAN სენსიტიური მონაცემებია: ჩაწერე მხოლოდ საჭიროების შემთხვევაში და წვდომა შეზღუდე ადმინისტრატორებით.', 'Personal ID and IBAN are sensitive data. Enter them only when necessary and restrict access to administrators.', 'Личный номер и IBAN — конфиденциальные данные. Указывайте их только при необходимости и ограничьте доступ администраторами.'],
    ['სახელი', 'First name', 'Имя'],
    ['გვარი', 'Last name', 'Фамилия'],
    ['პირადი / საიდენტიფიკაციო ნომერი', 'Personal / identification number', 'Личный / идентификационный номер'],
    ['ქვეყანა', 'Country', 'Страна'],
    ['ელფოსტა / გამყიდველის ID', 'Email / seller ID', 'Электронная почта / ID продавца'],
    ['KYC ჩანაწერის შენახვა', 'Save KYC record', 'Сохранить запись KYC'],
    ['რეგისტრირებული მომხმარებლები', 'Registered users', 'Зарегистрированные пользователи'],
    ['ძებნა', 'Search', 'Поиск'],
    ['ფილტრი', 'Filter', 'Фильтр'],
    ['ყველა', 'All', 'Все'],
    ['ხელოვანები / მაღაზიები', 'Creators / stores', 'Авторы / магазины'],
    ['დაბლოკილები', 'Blocked', 'Заблокированные'],
    ['მომხმარებლების სია Firebase-იდან ჩაიტვირთება.', 'The user list will load from Firebase.', 'Список пользователей будет загружен из Firebase.'],
    ['სპონსორებისა და პარტნიორების მართვა', 'Manage sponsors and partners', 'Управление спонсорами и партнёрами'],
    ['ლოგო', 'Logo', 'Логотип'],
    ['აღწერა', 'Description', 'Описание'],
    ['ვებგვერდი', 'Website', 'Веб-сайт'],
    ['დონე', 'Tier', 'Уровень'],
    ['პარტნიორი', 'Partner', 'Партнёр'],
    ['აქტიური', 'Active', 'Активен'],
    ['სპონსორის დამატება', 'Add sponsor', 'Добавить спонсора'],
    ['რეკლამები და ბანერები', 'Ads and banners', 'Реклама и баннеры'],
    ['სათაური', 'Title', 'Заголовок'],
    ['ბანერის სურათი', 'Banner image', 'Изображение баннера'],
    ['ბმული', 'Link', 'Ссылка'],
    ['განთავსების ადგილი', 'Placement', 'Место размещения'],
    ['მთავარი — Hero', 'Home — hero', 'Главная — первый экран'],
    ['კატალოგი', 'Catalog', 'Каталог'],
    ['Premium სექცია', 'Premium section', 'Раздел Premium'],
    ['არ გამოიყენო', 'Do not use', 'Не использовать'],
    ['ბანერის შექმნა', 'Create banner', 'Создать баннер'],
    ['მომხმარებლებისა და პროდუქტების რეპორტები', 'User and product reports', 'Жалобы на пользователей и товары'],
    ['მთავარი პარტნიორი და მოცურავე ზოლი', 'Main partner and ticker', 'Главный партнёр и бегущая строка'],
    ['პარტნიორის სახელი', 'Partner name', 'Название партнёра'],
    ['მოცურავე ზოლის ტექსტი', 'Ticker text', 'Текст бегущей строки'],
    ['პარტნიორის სახელი', 'Partner name', 'Название партнёра'],
    ['პარამეტრების შენახვა', 'Save settings', 'Сохранить настройки'],
    ['დავები და დაბრუნების აღრიცხვა', 'Disputes and refund records', 'Споры и учёт возвратов'],
    ['„დაბრუნებულად მონიშვნა“ მხოლოდ აღრიცხვის ჩანაწერს ქმნის და ტრანზაქციას უარყოფითად ასახავს. თანხის რეალური დაბრუნება უნდა შესრულდეს ბანკის/გადახდის პროვაიდერის გავლით.', '“Mark as refunded” only creates a ledger entry and records a negative transaction. Actual refunds must be processed through the bank/payment provider.', '«Отметить как возвращённый» создаёт только запись в журнале и отражает отрицательную транзакцию. Фактический возврат должен быть выполнен через банк/платёжного провайдера.'],
    ['შეკვეთის / ტრანზაქციის ID', 'Order / transaction ID', 'ID заказа / транзакции'],
    ['მომჩივანი', 'Reporter', 'Заявитель'],
    ['მიზეზი', 'Reason', 'Причина'],
    ['დავის რეგისტრაცია', 'Register dispute', 'Зарегистрировать спор'],
    ['კატეგორიებისა და ტეგების მართვა', 'Manage categories and tags', 'Управление категориями и тегами'],
    ['კატეგორია', 'Category', 'Категория'],
    ['ტეგი', 'Tag', 'Тег'],
    ['დამატება', 'Add', 'Добавить'],
    ['ფასდაკლების კოდები', 'Discount codes', 'Промокоды'],
    ['კოდების შექმნა Firestore-შია, თუმცა checkout-ის ფასი ამ ვერსიაში მხოლოდ დემოა და პრომო კოდი რეალურ გადახდას არ ცვლის.', 'Codes are created in Firestore, but checkout pricing is a demo and promo codes do not affect real payments.', 'Коды создаются в Firestore, но цена оформления заказа в этой версии демонстрационная, а промокод не влияет на реальную оплату.'],
    ['კოდი', 'Code', 'Код'],
    ['ფასდაკლება (%)', 'Discount (%)', 'Скидка (%)'],
    ['ვადა', 'Expires', 'Срок действия'],
    ['კოდის შექმნა', 'Create code', 'Создать код'],
    ['ადმინისტრატორის აქტივობა', 'Administrator activity', 'Активность администратора'],
    ['საკომისიოს მართვა', 'Commission settings', 'Настройки комиссии'],
    ['საკომისიო პროცენტი (%)', 'Commission rate (%)', 'Комиссия (%)'],
    ['შენახვა', 'Save', 'Сохранить'],
    ['შენახული პროცენტი გამოიყენება შეკვეთის საკომისიოსა და გამყიდველის წილის გამოსათვლელად.', 'The saved rate is used to calculate the order commission and seller share.', 'Сохранённая ставка используется для расчёта комиссии заказа и доли продавца.'],
    ['ფინანსური ჩანაწერები და payout-ები', 'Finance records and payouts', 'Финансовые записи и выплаты'],
    ['ტრანზაქციების ჩანაწერი', 'Transaction record', 'Запись о транзакции'],
    ['ხელოვანის / გამყიდველის ID', 'Creator / seller ID', 'ID автора / продавца'],
    ['პრომო კოდის შექმნა', 'Create promo code', 'Создать промокод'],
    ['საკომისიოს შენახვა', 'Save commission', 'Сохранить комиссию'],
    ['შეკვეთის სტატუსი განახლდა.', 'Order status updated.', 'Статус заказа обновлён.'],
    ['დავის ჩანაწერი შენახულია.', 'Dispute record saved.', 'Запись о споре сохранена.'],
    ['ტრანზაქცია აღრიცხვაში დაემატა.', 'Transaction added to the ledger.', 'Транзакция добавлена в журнал.'],
    ['პარტნიორი დაემატა.', 'Partner added.', 'Партнёр добавлен.'],
    ['სპონსორი წაიშალა.', 'Sponsor deleted.', 'Спонсор удалён.'],
    ['რეკლამა დაემატა.', 'Ad added.', 'Реклама добавлена.'],
    ['პრომო კოდი დაემატა.', 'Promo code added.', 'Промокод добавлен.'],
    ['საიტის პარამეტრები ვერ შეინახა.', 'Could not save site settings.', 'Не удалось сохранить настройки сайта.'],
    ['ცვლილება შენახულია.', 'Changes saved.', 'Изменения сохранены.'],
    ['კატეგორია დაემატა.', 'Category added.', 'Категория добавлена.'],
    ['ტეგი დაემატა.', 'Tag added.', 'Тег добавлен.'],
    ['აქტივობის ჩანაწერები არ არის.', 'There are no activity records.', 'Записей активности нет.'],
    ['რეპორტი', 'Report', 'Жалоба'],
    ['მოლოდინში მყოფი პროდუქტი არ არის.', 'There are no pending products.', 'Нет товаров на проверке.'],
    ['პროდუქტი ჯერ არ არის.', 'There are no products yet.', 'Товаров пока нет.'],
    ['გადახდის ან ბალანსის მოთხოვნა არ არის.', 'There are no payment or balance requests.', 'Нет запросов на оплату или пополнение.'],
    ['მომხმარებელი ამ ფილტრით ვერ მოიძებნა.', 'No users match this filter.', 'По этому фильтру пользователи не найдены.'],
    ['დამტკიცება', 'Approve', 'Подтвердить'],
    ['უარყოფა', 'Reject', 'Отклонить'],
    ['რედაქტირება', 'Edit', 'Изменить'],
    ['წაშლა', 'Delete', 'Удалить'],
    ['ტრანზაქცია: ', 'Transaction: ', 'Транзакция: '],
    ['მაღაზია: ', 'Store: ', 'Магазин: '],
    ['ტელეფონი: ', 'Phone: ', 'Телефон: '],
    ['მისამართი: ', 'Address: ', 'Адрес: '],
    ['აღწერა: ', 'Bio: ', 'Описание: '],
    ['ვებგვერდი: ', 'Website: ', 'Веб-сайт: '],
    ['ხელოვანი: ', 'Creator: ', 'Автор: '],
    ['მყიდველი / კერძო პირი · რეგისტრაცია: ', 'Buyer / individual · registered: ', 'Покупатель / частное лицо · регистрация: '],
    ['ხელოვანი / მაღაზია · რეგისტრაცია: ', 'Creator / store · registered: ', 'Автор / магазин · регистрация: '],
    ['შეკვეთა #', 'Order #', 'Заказ №'],
    ['მოლოდინში მყოფი პროდუქტი არ არის.', 'There are no pending products.', 'Нет товаров на проверке.'],
    ['გადახდის ან ბალანსის მოთხოვნა არ არის.', 'There are no payment or balance requests.', 'Нет запросов на оплату или пополнение.'],
    ['უფასო Boost', 'Free Boost', 'Бесплатный Boost'],
    ['ბონუსის დონე', 'Bonus tier', 'Уровень бонуса'],
    ['ბონუსის შენახვა', 'Save bonus', 'Сохранить бонус'],
    ['საკომისიოს შეღავათი (%)', 'Commission discount (%)', 'Скидка на комиссию (%)'],
    ['მყიდველი / კერძო პირი', 'Buyer / individual', 'Покупатель / частное лицо'],
    ['ხელოვანი / მაღაზია', 'Creator / store', 'Автор / магазин'],
    ['დაბლოკილი', 'Blocked', 'Заблокирован'],
    ['აქტიური', 'Active', 'Активен'],
    ['ვერიფიცირებული', 'Verified', 'Проверен'],
    ['ვერიფიკაცია', 'Verify', 'Проверить'],
    ['ვერიფიკაციის მოხსნა', 'Remove verification', 'Снять проверку'],
    ['VIP მინიჭება', 'Grant VIP', 'Назначить VIP'],
    ['VIP-ის მოხსნა', 'Remove VIP', 'Снять VIP'],
    ['დაბლოკვა', 'Block', 'Заблокировать'],
    ['განბლოკვა', 'Unblock', 'Разблокировать'],
    ['ხელმისაწვდომი თანხა: ', 'Available amount: ', 'Доступная сумма: '],
    ['მოლოდინშია', 'Pending', 'Ожидает проверки'],
    ['გამოგზავნილია', 'Shipped', 'Отправлен'],
    ['ჩაბარებულია', 'Delivered', 'Доставлен'],
    ['გადახდილია', 'Paid', 'Выплачено'],
    ['შეკავებულია', 'Held', 'Удерживается'],
    ['მიწოდებას ელოდება', 'Awaiting delivery', 'Ожидает доставки'],
    ['არ ვრცელდება', 'Not applicable', 'Не применяется'],
    ['მთლიანი გაყიდვები', 'Gross sales', 'Валовые продажи'],
    ['წმინდა შემოსავალი', 'Net revenue', 'Чистый доход'],
    ['ხელოვანის წილი', 'Creator share', 'Доля автора'],
    ['შეკავების მოხსნა', 'Release hold', 'Снять удержание'],
    ['წაშლილია', 'Deleted', 'Удалён'],
    ['დამალულია', 'Hidden', 'Скрыт'],
    ['გამოგზავნილად მონიშვნა', 'Mark as shipped', 'Отметить как отправленный'],
    ['ჩაბარებულად მონიშვნა', 'Mark as delivered', 'Отметить как доставленный'],
    ['არჩეულ პერიოდში ტრანზაქციები არ არის.', 'No transactions in the selected period.', 'За выбранный период транзакций нет.'],
    ['Hold-ის მოხსნა', 'Release hold', 'Снять удержание'],
    ['ბანკის ნომერი არ არის', 'No bank reference', 'Нет номера банковского перевода'],
    ['საბანკო გადარიცხვის ნომერი', 'Bank transfer reference', 'Номер банковского перевода'],
    ['გადარიცხულად მონიშვნა', 'Mark as paid', 'Отметить как выплаченное'],
    ['Payout ჩანაწერი ჯერ არ არის.', 'There are no payout records yet.', 'Записей о выплатах пока нет.'],
    ['მისამართი: ', 'Address: ', 'Адрес: '],
    ['სატესტო გადახდა — რეალური თანხა არ ჩამოჭრილა.', 'Test payment — no real money was charged.', 'Тестовый платёж — реальные деньги не списаны.'],
    ['Escrow hold: ', 'Escrow hold: ', 'Удержание эскроу: '],
    ['შეკვეთები ჯერ არ არის.', 'There are no orders yet.', 'Заказов пока нет.'],
    ['KYC:', 'KYC:', 'KYC:'],
    ['დამტკიცებულია', 'Approved', 'Подтверждено'],
    ['მოლოდინში', 'Pending', 'На проверке'],
    ['დაბლოკილია', 'Blocked', 'Заблокирован'],
    ['აქტიურია', 'Active', 'Активен'],
    ['ვერიფიკაცია განახლდეს', 'Update verification', 'Обновить проверку'],
    ['Verify Vendor', 'Verify seller', 'Проверить продавца'],
    ['VIP 30 დღით ', 'VIP for 30 days ', 'VIP на 30 дней '],
    ['განახლება', 'Renew', 'Продлить'],
    ['მინიჭება', 'Grant', 'Назначить'],
    ['VIP შეჩერება', 'Suspend VIP', 'Приостановить VIP'],
    ['გამყიდველის დაბლოკვა', 'Block seller', 'Заблокировать продавца'],
    ['დავის დახურვა', 'Close dispute', 'Закрыть спор'],
    ['დაბრუნებულად აღრიცხვა', 'Record refund', 'Учесть возврат'],
    ['კატეგორია:', 'Category:', 'Категория:'],
    ['ტეგი:', 'Tag:', 'Тег:'],
    ['კატეგორია ან ტეგი ჯერ არ დამატებულა.', 'No categories or tags have been added yet.', 'Категории и теги пока не добавлены.'],
    ['ვადა: ', 'Expires: ', 'Срок: '],
    ['აქტიურია', 'Active', 'Активен'],
    ['გამორთულია', 'Inactive', 'Отключён'],
    ['ჟურნალი ცარიელია.', 'The activity log is empty.', 'Журнал активности пуст.'],
    ['ვებგვერდი', 'Website', 'Веб-сайт'],
    ['ბმულის ნახვა', 'View link', 'Открыть ссылку'],
    ['Boost-ის მოხსნა', 'Remove Boost', 'Снять Boost'],
    ['Featured / Boost', 'Featured / Boost', 'Featured / Boost'],
    ['სარეკლამო ბანერი ჯერ არ შექმნილა.', 'No ad banners have been created yet.', 'Рекламные баннеры ещё не созданы.'],
    ['მომხმარებლის რეპორტი', 'User report', 'Жалоба на пользователя'],
    ['პროდუქტის რეპორტი', 'Product report', 'Жалоба на товар'],
    ['რეპორტიორი UID: ', 'Reporter UID: ', 'UID заявителя: '],
    ['განხილულია / დახურვა', 'Reviewed / close', 'Рассмотрено / закрыть'],
    ['რეპორტი არ არის.', 'There are no reports.', 'Жалоб нет.'],
    ['Net Revenue', 'Net revenue', 'Чистая выручка'],
    ['Artist', 'Creator', 'Автор'],
    ['Payout', 'Payout', 'Выплата'],
    ['Payout ჩანაწერი ჯერ არ არის.', 'There are no payout records yet.', 'Записей о выплатах пока нет.'],
    ['შეჩერებულია', 'Suspended', 'Приостановлен'],
    ['საბანკო ნომერი არ არის', 'No bank reference', 'Нет номера банковского перевода'],
    ['სახელი ცარიელია ან უკვე არსებობს.', 'The name is empty or already exists.', 'Имя не указано или уже существует.'],
    ['პრომო კოდი ან ფასდაკლების პროცენტი არასწორია.', 'The promo code or discount percentage is invalid.', 'Промокод или размер скидки указаны неверно.'],
    ['ეს კოდი უკვე არსებობს.', 'This code already exists.', 'Этот код уже существует.'],
    ['ბანერის სურათის ატვირთვა აუცილებელია.', 'A banner image is required.', 'Необходимо загрузить изображение баннера.'],
    ['რეკლამის ბმული უნდა იყოს http ან https მისამართი.', 'The ad link must use HTTP or HTTPS.', 'Ссылка на рекламу должна использовать HTTP или HTTPS.'],
    ['Escrow ვადა არ გასულა ან ტრანზაქციაზე ღია დავაა.', 'The escrow period has not ended or the transaction has an open dispute.', 'Срок эскроу не истёк или по транзакции открыт спор.'],
    ['გამყიდველი ვერ მოიძებნა.', 'Seller not found.', 'Продавец не найден.'],
    ['დავა ვერ მოიძებნა.', 'Dispute not found.', 'Спор не найден.'],
    ['რეკლამა ვერ მოიძებნა.', 'Ad not found.', 'Реклама не найдена.'],
    ['Boost-ისთვის მიუთითე Featured პროდუქტის ID და Boost დონე.', 'Enter a featured product ID and Boost tier to enable Boost.', 'Чтобы включить Boost, укажите ID избранного товара и уровень Boost.'],
    ['საკომისიოს პარამეტრი ჯერ არ ჩაიტვირთა ან არასწორია.', 'Commission settings have not loaded or are invalid.', 'Настройки комиссии не загружены или указаны неверно.'],
    ['თანხა უნდა იყოს დადებითი.', 'The amount must be positive.', 'Сумма должна быть положительной.'],
    ['მიწოდების თარიღი არასწორია.', 'The delivery date is invalid.', 'Дата доставки указана неверно.'],
    ['საბანკო გადარიცხვის ნომერი აუცილებელია.', 'A bank transfer reference is required.', 'Необходимо указать номер банковского перевода.'],
    ['მოლოდინის payout ვერ მოიძებნა.', 'Pending payout not found.', 'Ожидаемая выплата не найдена.'],
    ['ესკრო თანხაზე დავა გაიხსნა ან ხელმისაწვდომი ბალანსი შეიცვალა.', 'A dispute was opened against escrow funds or the available balance changed.', 'По средствам эскроу открыт спор или доступный баланс изменился.'],
    ['დაკავშირებული გაყიდვის ტრანზაქცია ვერ მოიძებნა.', 'The related sale transaction was not found.', 'Связанная транзакция продажи не найдена.'],
    ['ხელმისაწვდომი თანხა: ', 'Available amount: ', 'Доступная сумма: '],
    ['. მხოლოდ ესკრო-ვადის გასული თანხის გადარიცხვა შეიძლება.', '. Only funds past the escrow period can be paid out.', '. Можно выплатить только средства после окончания срока эскроу.'],
    ['პროდუქტის სახელი', 'Product name', 'Название товара'],
    ['ფასი (₾)', 'Price (GEL)', 'Цена (₾)'],
    ['რედაქტირება', 'Edit', 'Изменить'],
    ['წაშლა', 'Delete', 'Удалить'],
    ['დამტკიცება', 'Approve', 'Подтвердить'],
    ['უარყოფა', 'Reject', 'Отклонить'],
    ['დადასტურება', 'Approve', 'Подтвердить'],
    ['უარყოფილია', 'Rejected', 'Отклонено'],
    ['დადასტურებულია', 'Approved', 'Подтверждено'],
    ['PIN მოწმდება…', 'Verifying PIN…', 'Проверка PIN-кода…'],
    ['PIN სესია ვადაგასულია. შედი თავიდან.', 'The PIN session expired. Sign in again.', 'Срок действия PIN-сессии истёк. Войдите снова.'],
    ['საკომისიო უნდა იყოს 0-დან 100%-მდე.', 'Commission must be between 0 and 100%.', 'Комиссия должна быть от 0 до 100%.'],
    ['საკომისიო შენახულია.', 'Commission saved.', 'Комиссия сохранена.'],
    ['საკომისიოს შენახვა ვერ მოხერხდა.', 'Could not save commission.', 'Не удалось сохранить комиссию.'],
    ['ოპერაცია ვერ შესრულდა.', 'The operation failed.', 'Не удалось выполнить операцию.'],
    ['საიტის პარამეტრები განახლდა.', 'Site settings updated.', 'Настройки сайта обновлены.'],
    ['განახლებულია', 'Updated', 'Обновлено'],
    ['წაშლა', 'Delete', 'Удалить'],
    ['დაბრუნებულად მონიშვნა', 'Mark as refunded', 'Отметить как возвращённый'],
    ['ჩაბარებულად მონიშვნა', 'Mark as delivered', 'Отметить как доставленный'],
    ['პარტნიორი: ', 'Partner: ', 'Партнёр: '],
    ['ტრანზაქცია: ', 'Transaction: ', 'Транзакция: '],
    ['მაღაზია: ', 'Store: ', 'Магазин: '],
    ['ტელეფონი: ', 'Phone: ', 'Телефон: '],
    ['მისამართი: ', 'Address: ', 'Адрес: '],
    ['აღწერა: ', 'Bio: ', 'Биография: '],
    ['ვებგვერდი: ', 'Website: ', 'Веб-сайт: '],
    ['მომხმარებლები იტვირთება…', 'Loading users…', 'Загрузка пользователей…'],
    ['მომხმარებელი ჯერ არ არის.', 'There are no users yet.', 'Пользователей пока нет.'],
    ['მომხმარებლების სია ვერ ჩაიტვირთა.', 'Could not load the user list.', 'Не удалось загрузить список пользователей.'],
    ['დამტკიცებულია', 'Approved', 'Подтверждено'],
    ['მოლოდინშია', 'Pending', 'Ожидает проверки'],
    ['განახლება ვერ მოხერხდა.', 'Update failed.', 'Не удалось обновить.'],
    ['გადახდის მოთხოვნის განახლება ვერ მოხერხდა.', 'Could not update the payment request.', 'Не удалось обновить запрос на оплату.'],
    ['მომხმარებლის სტატუსი განახლდა.', 'User status updated.', 'Статус пользователя обновлён.'],
    ['მომხმარებლის სტატუსის განახლება ვერ მოხერხდა.', 'Could not update user status.', 'Не удалось обновить статус пользователя.'],
    ['ბონუსის მნიშვნელობები არასწორია.', 'Bonus values are invalid.', 'Значения бонуса указаны неверно.'],
    ['ბონუსის განახლება ვერ მოხერხდა.', 'Could not update the bonus.', 'Не удалось обновить бонус.'],
    ['საკომისიო სერვერზე შენახულია, მაგრამ ამ ბრაუზერში მყისიერი სინქრონიზაცია ვერ მოხერხდა.', 'Commission was saved on the server, but could not be synchronized in this browser.', 'Комиссия сохранена на сервере, но не удалось синхронизировать её в этом браузере.'],
    ['მონაცემები იტვირთება…', 'Loading data…', 'Загрузка данных…'],
    ['მონაცემები იტვირთება', 'Loading data', 'Загрузка данных'],
    ['PIN სესია აქტიურია · მონაცემები იტვირთება…', 'PIN session active · loading data…', 'PIN-сессия активна · загрузка данных…'],
    ['ლოკალური სატესტო რეჟიმი · მონაცემები დროებითია', 'Local test mode · data is temporary', 'Локальный тестовый режим · данные временные'],
    ['მხოლოდ ამ ბრაუზერის მონაცემები · საერთო სერვერის კონფიგურაცია მიუწვდომელია', 'This browser only · shared server configuration unavailable', 'Только этот браузер · настройки общего сервера недоступны'],
    ['პროდუქტის რედაქტირება ვერ მოხერხდა.', 'Could not edit product.', 'Не удалось изменить товар.'],
    ['პროდუქტის განახლება ვერ მოხერხდა.', 'Could not update product.', 'Не удалось обновить товар.'],
    ['PIN სესიის შემოწმება ვერ მოხერხდა.', 'Could not verify the PIN session.', 'Не удалось проверить PIN-сессию.'],
    ['საკომისიო პარამეტრის ჩატვირთვა ვერ მოხერხდა.', 'Could not load commission settings.', 'Не удалось загрузить настройки комиссии.'],
    ['პროდუქტი ვერ მოიძებნა.', 'Product not found.', 'Товар не найден.'],
    ['მომხმარებელი ვერ მოიძებნა.', 'User not found.', 'Пользователь не найден.'],
    ['მონაცემები ვერ ჩაიტვირთა.', 'Could not load data.', 'Не удалось загрузить данные.'],
    ['განახლებულია', 'Updated', 'Обновлено'],
    ['წესები და პირობები | DropZone Market', 'Terms and conditions | DropZone Market', 'Условия использования | DropZone Market'],
    ['დაბრუნება და დავები | DropZone Market', 'Returns and disputes | DropZone Market', 'Возврат и споры | DropZone Market'],
    ['განახლებულია: 2026', 'Updated: 2026', 'Обновлено: 2026'],
    ['გამოყენების პირობები', 'Terms of use', 'Условия использования'],
    ['წესები და', 'Terms and', 'Правила и'],
    ['პირობები', 'conditions', 'условия'],
    ['პლატფორმის გამოყენებით ეთანხმები ქვემოთ მოცემულ წესებს.', 'By using the platform, you agree to the terms below.', 'Используя платформу, вы соглашаетесь с приведёнными ниже условиями.'],
    ['1. პლატფორმის როლი', '1. Platform role', '1. Роль платформы'],
    ['DropZone Market წარმოადგენს დამოუკიდებელ გამყიდველებსა და მყიდველებს შორის განცხადებების განთავსებისა და კომუნიკაციის ტექნიკურ შუამავალ პლატფორმას. ნივთის გამყიდველი და მყიდველი თავად აფორმებენ გარიგებას; DropZone არ არის ნივთის გამყიდველი, მწარმოებელი ან მფლობელი და არ იძლევა გამყიდველის მიერ შეთავაზებული ნივთის ხარისხის გარანტიას.', 'DropZone Market is a technical intermediary platform for listings and communication between independent sellers and buyers. The seller and buyer make the transaction themselves; DropZone is not the seller, manufacturer or owner of items and does not guarantee their quality.', 'DropZone Market — техническая платформа-посредник для размещения объявлений и общения независимых продавцов и покупателей. Сделку заключают сами продавец и покупатель; DropZone не является продавцом, производителем или владельцем товара и не гарантирует его качество.'],
    ['2. ანგარიშები და მომხმარებლის ქცევა', '2. Accounts and user conduct', '2. Аккаунты и поведение пользователей'],
    ['მომხმარებელი ვალდებულია მიუთითოს ზუსტი ინფორმაცია, დაიცვას ანგარიშის წვდომა და არ გამოიყენოს პლატფორმა უკანონო, თაღლითური ან სხვებისთვის საზიანო საქმიანობისთვის. DropZone-ს შეუძლია შეამოწმოს, დამალოს ან წაშალოს წესების დამრღვევი განცხადება და შეზღუდოს ანგარიშის წვდომა.', 'Users must provide accurate information, protect account access and not use the platform for illegal, fraudulent or harmful activity. DropZone may review, hide or remove listings that violate the rules and restrict account access.', 'Пользователи обязаны указывать точную информацию, защищать доступ к аккаунту и не использовать платформу для незаконной, мошеннической или вредоносной деятельности. DropZone может проверять, скрывать или удалять объявления, нарушающие правила, и ограничивать доступ к аккаунту.'],
    ['3. განცხადებები და საავტორო უფლებები', '3. Listings and copyright', '3. Объявления и авторские права'],
    ['გამყიდველი ადასტურებს, რომ აქვს განცხადებაში გამოყენებული ტექსტის, ფოტოს, ლოგოსა და სხვა მასალის გამოქვეყნების უფლება. აკრძალულია სხვისი საავტორო ან სასაქონლო ნიშნის უფლებების დარღვევა, ყალბი ან შეცდომაში შემყვანი ინფორმაციის განთავსება და აკრძალული საქონლის შეთავაზება. უფლებების დარღვევის შესახებ შეტყობინება გამოგზავნე', 'The seller confirms they have the right to publish the text, photos, logo and other material used in a listing. Infringing another party’s copyright or trademark, posting false or misleading information, and offering prohibited goods are not allowed. To report an infringement, use', 'Продавец подтверждает, что имеет право публиковать текст, фотографии, логотип и другие материалы объявления. Запрещено нарушать авторские права или права на товарные знаки, размещать ложную или вводящую в заблуждение информацию и предлагать запрещённые товары. Чтобы сообщить о нарушении прав, воспользуйтесь'],
    ['4. შეკვეთები და გადახდები', '4. Orders and payments', '4. Заказы и платежи'],
    ['ამ ვერსიაში Checkout სატესტოა და რეალურ საბანკო გადახდას არ ამუშავებს. არ შეიყვანო ან გააზიარო ბარათის ნომერი, CVV/CVC ან სხვა საბანკო საიდუმლო მონაცემი. რეალური შეკვეთის პირობები, ფასი და მიწოდება მყიდველმა გამყიდველთან უნდა დაადასტუროს.', 'Checkout in this version is a test and does not process real bank payments. Do not enter or share a card number, CVV/CVC or other confidential banking information. The buyer should confirm the terms, price and delivery of a real order with the seller.', 'Оформление заказа в этой версии тестовое и не обрабатывает реальные банковские платежи. Не вводите и не сообщайте номер карты, CVV/CVC или другие конфиденциальные банковские данные. Условия, цену и доставку реального заказа покупатель должен согласовать с продавцом.'],
    ['5. რეპორტები და დავები', '5. Reports and disputes', '5. Жалобы и споры'],
    ['საეჭვო განცხადების ან მომხმარებლის შესახებ შეგვატყობინე პროდუქტის დეტალების რეპორტის ღილაკით ან', 'Report a suspicious listing or user using the report button in the product details or', 'Сообщите о подозрительном объявлении или пользователе с помощью кнопки жалобы в сведениях о товаре или'],
    ['. მიუთითე განცხადების ან ანგარიშის ბმული, საკითხის აღწერა და საჭირო მტკიცებულება. პლატფორმა განიხილავს შეტყობინებას და შეუძლია შეზღუდოს შესაბამისი მასალა ან ანგარიში, თუმცა მყიდველსა და გამყიდველს შორის დავის საბოლოო გადაწყვეტას ან თანხის დაბრუნებას არ უზრუნველყოფს.', '. Include a link to the listing or account, a description of the issue and any relevant evidence. The platform will review the report and may restrict the relevant content or account, but does not make final decisions on buyer-seller disputes or issue refunds.', '. Укажите ссылку на объявление или аккаунт, описание проблемы и необходимые доказательства. Платформа рассмотрит сообщение и может ограничить соответствующий материал или аккаунт, но не выносит окончательных решений по спорам между покупателями и продавцами и не возвращает деньги.'],
    ['6. პირობების ცვლილება', '6. Changes to terms', '6. Изменение условий'],
    ['პირობები შეიძლება განახლდეს პლატფორმის ფუნქციების ან მოქმედი მოთხოვნების ცვლილებისას. განახლებული ვერსია ამ გვერდზე გამოქვეყნდება. ეს ტექსტი არ ცვლის მომხმარებლისთვის კანონით მინიჭებულ უფლებებს; გამოქვეყნებამდე რეკომენდებულია იურიდიული სპეციალისტის მიერ შემოწმება.', 'These terms may be updated when platform features or applicable requirements change. The updated version will be published on this page. This text does not replace rights granted to users by law; legal review is recommended before publication.', 'Условия могут обновляться при изменении функций платформы или применимых требований. Обновлённая версия будет опубликована на этой странице. Этот текст не заменяет права пользователей, предусмотренные законом; перед публикацией рекомендуется юридическая проверка.'],
    ['გამჭვირვალე პროცესი', 'A transparent process', 'Прозрачный процесс'],
    ['შეკვეთის პირობები გარიგების დადებამდე პირდაპირ გამყიდველთან დაადასტურე.', 'Confirm order terms directly with the seller before making a transaction.', 'Согласуйте условия заказа напрямую с продавцом до совершения сделки.'],
    ['პლატფორმის სტატუსი', 'Platform status', 'Статус платформы'],
    ['DropZone Market აკავშირებს დამოუკიდებელ მყიდველებსა და გამყიდველებს და არ არის ნივთის გამყიდველი ან გადახდის მიმღები. მიმდინარე ვერსიის Checkout სატესტოა; პლატფორმის გავლით რეალური საბანკო გადახდა და თანხის ავტომატური დაბრუნება არ სრულდება.', 'DropZone Market connects independent buyers and sellers and is not the seller of items or the recipient of payments. Checkout in this version is a test; real bank payments and automatic refunds are not processed through the platform.', 'DropZone Market связывает независимых покупателей и продавцов и не является продавцом товара или получателем платежа. Оформление заказа в этой версии тестовое; реальные банковские платежи и автоматический возврат средств через платформу не выполняются.'],
    ['დაბრუნების მოთხოვნა', 'Requesting a refund', 'Запрос возврата'],
    ['ნივთის დაბრუნების, შეცვლის ან თანხის ანაზღაურების პირობები მყიდველმა გამყიდველთან უნდა შეათანხმოს და შეინახოს შეკვეთის, გადახდისა და მიმოწერის დამადასტურებელი მასალა. მოქმედი კანონით მინიჭებული უფლებები ძალაში რჩება და ამ გვერდით არ იზღუდება.', 'The buyer should agree return, exchange or refund terms with the seller and keep records of the order, payment and correspondence. Rights granted by applicable law remain in effect and are not restricted by this page.', 'Покупатель должен согласовать с продавцом условия возврата, обмена или возмещения и сохранить подтверждения заказа, оплаты и переписки. Права, предоставленные действующим законодательством, сохраняют силу и не ограничиваются этой страницей.'],
    ['დავის შეტყობინება და განხილვა', 'Reporting and reviewing a dispute', 'Сообщение о споре и его рассмотрение'],
    ['დაუკავშირდი გამყიდველს და აღწერე საკითხი წერილობით.', 'Contact the seller and describe the issue in writing.', 'Свяжитесь с продавцом и опишите проблему письменно.'],
    ['თუ პრობლემა არ მოგვარდა, DropZone-ს გაუგზავნე შეკვეთის ან განცხადების იდენტიფიკატორი, პრობლემის მოკლე აღწერა და შესაბამისი მტკიცებულება', 'If the issue is not resolved, send DropZone the order or listing ID, a brief description and relevant evidence', 'Если проблема не решена, отправьте DropZone номер заказа или объявления, краткое описание и соответствующие доказательства'],
    ['კონტაქტის გვერდიდან', 'from the contact page', 'со страницы контактов'],
    ['ან პროდუქტის რეპორტის ფორმით.', 'or use the product report form.', 'или воспользуйтесь формой жалобы на товар.'],
    ['პლატფორმა მიღებულ ინფორმაციას განიხილავს, საჭიროების შემთხვევაში მოითხოვს დამატებით ინფორმაციას და მიიღებს შესაბამის მოდერაციის ზომებს.', 'The platform will review the information, request more details if needed and take appropriate moderation measures.', 'Платформа рассмотрит информацию, при необходимости запросит дополнительные сведения и примет соответствующие меры модерации.'],
    ['DropZone ხელს უწყობს მხარეებს შორის კომუნიკაციას, მაგრამ არ იღებს გადაწყვეტილებას თანხის დაბრუნების ვალდებულებაზე და თავად არ ახორციელებს თანხის გადარიცხვას. ფინანსური დავისას მომხმარებელს შეუძლია მიმართოს შესაბამის გადახდის პროვაიდერს ან უფლებამოსილ ორგანოს.', 'DropZone supports communication between the parties but does not decide whether a refund is owed and does not transfer funds. For a financial dispute, users may contact the relevant payment provider or competent authority.', 'DropZone содействует общению сторон, но не решает вопрос об обязанности вернуть деньги и не переводит средства. При финансовом споре пользователь может обратиться к соответствующему платёжному провайдеру или уполномоченному органу.'],
    ['ინტელექტუალური საკუთრების საჩივრები', 'Intellectual property complaints', 'Жалобы на нарушение интеллектуальной собственности']
    ,['თუ ფიქრობ, რომ განცხადება არღვევს საავტორო ან სასაქონლო ნიშნის უფლებას, გამოგვიგზავნე მასალის ბმული, უფლების მფლობელის ინფორმაცია და დარღვევის განმარტება', 'If you believe a listing infringes copyright or trademark rights, send us the material link, rights-holder information and an explanation of the infringement', 'Если вы считаете, что объявление нарушает авторские права или права на товарный знак, отправьте ссылку на материал, сведения о правообладателе и описание нарушения']
    ,['ადმინისტრატორის PIN', 'Administrator PIN', 'PIN-код администратора']
    ,['მომხმარებლის ძებნა', 'Search users', 'Поиск пользователей']
    ,['სახელი ან ელ-ფოსტა', 'Name or email', 'Имя или электронная почта']
    ,['ბანკი / ბარათი', 'Bank / card', 'Банк / карта']
    ,['ვებგვერდი', 'Website', 'Веб-сайт']
    ,['ხელოვანის ID', 'Creator ID', 'ID автора']
    ,['შენახული პროცენტი გამოიყენება შეკვეთის საკომისიოსა და გამყიდველის წილის გამოსათვლელად.', 'The saved rate is used to calculate the order commission and seller share.', 'Сохранённая ставка используется для расчёта комиссии заказа и доли продавца.']
    ,['მომხმარებლების სია Firebase-იდან ჩაიტვირთება.', 'The user list will load from Firebase.', 'Список пользователей будет загружен из Firebase.']
    ,['პროდუქტის სახელი', 'Product name', 'Название товара']
    ,['სახელი ან მაღაზიის სახელი', 'Name or store name', 'Имя или название магазина']
    ,['მომხმარებლის დახმარება', 'Customer support', 'Помощь пользователям']
    ,['დაბრუნება', 'Returns', 'Возврат']
    ,['და დავები', 'and disputes', 'и споры']
    ,['და დაურთე განცხადების ბმული და უფლების დამადასტურებელი ინფორმაცია.', 'and include the listing link and evidence of your rights.', 'и приложите ссылку на объявление и подтверждение ваших прав.']
    ,['DROPZONE / LEGAL', 'DROPZONE / LEGAL', 'DROPZONE / ПРАВОВАЯ ИНФОРМАЦИЯ']
    ,['DROPZONE / SUPPORT', 'DROPZONE / SUPPORT', 'DROPZONE / ПОДДЕРЖКА']
  ].map(([ka, en, ru]) => [ka, { ka, en, ru }]));
  const pageTextPrefixes = [...pageTextTranslations.entries()]
    .filter(([key]) => key.endsWith(' '))
    .sort((left, right) => right[0].length - left[0].length);
  const localizedTextNodes = new WeakMap();
  const localizedAttributes = new WeakMap();
  const initialPageTitle = document.title;
  let currentLanguage = savedLanguage;
  const staticPageRoot = () => document.querySelector('.admin-dashboard:not(.admin-pin-page)') || document.querySelector('.legal-page');
  function translateStaticPage(language) {
    if (hasApp) return;
    const root = staticPageRoot();
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const original = localizedTextNodes.has(node) ? localizedTextNodes.get(node) : node.nodeValue;
      localizedTextNodes.set(node, original);
      const trimmed = original.trim();
      const exact = pageTextTranslations.get(trimmed)?.[language];
      const prefix = exact ? null : pageTextPrefixes.find(([key]) => trimmed.startsWith(key));
      const translated = exact || (prefix ? `${prefix[1][language]}${trimmed.slice(prefix[0].length)}` : original);
      node.nodeValue = translated === original ? original : original.replace(trimmed, translated);
    });
    root.querySelectorAll('[placeholder], [aria-label], [title]').forEach(element => {
      let originals = localizedAttributes.get(element);
      if (!originals) {
        originals = new Map();
        localizedAttributes.set(element, originals);
      }
      ['placeholder', 'aria-label', 'title'].forEach(attribute => {
        const current = element.getAttribute(attribute);
        if (current === null) return;
        if (!originals.has(attribute)) originals.set(attribute, current);
        const original = originals.get(attribute);
        element.setAttribute(attribute, pageTextTranslations.get(original)?.[language] || original);
      });
    });
  }
  function watchStaticPage() {
    if (hasApp || !staticPageRoot()) return;
    const root = staticPageRoot();
    new MutationObserver(records => {
      if (records.some(record => record.addedNodes.length)) translateStaticPage(currentLanguage);
    }).observe(root, { childList: true, subtree: true });
  }
  function setLanguageSwitcherOpen(open, activeSwitcher) {
    document.querySelectorAll('.language-switcher').forEach(switcher => {
      const isOpen = open && switcher === activeSwitcher;
      switcher.classList.toggle('is-open', isOpen);
      switcher.querySelector('[data-language-trigger]')?.setAttribute('aria-expanded', String(isOpen));
      switcher.querySelector('.language-options')?.setAttribute('aria-hidden', String(!isOpen));
    });
  }
  function applySharedLanguage(language) {
    const text = sharedLanguageCopy[language];
    if (!text) return;
    currentLanguage = language;
    document.documentElement.lang = language;
    document.querySelectorAll('.main-nav [data-nav]').forEach((link, index) => {
      link.textContent = text.nav[index] || link.textContent;
    });
    document.querySelectorAll('[data-language]').forEach(button => {
      const selected = button.dataset.language === language;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-language-trigger]').forEach(button => {
      button.innerHTML = languageFlags[language];
      button.setAttribute('aria-label', `${text.language}: ${languageLabels[language]}`);
      button.title = languageLabels[language];
    });
    document.querySelector('.main-nav')?.setAttribute('aria-label', language === 'ka' ? 'მთავარი ნავიგაცია' : language === 'en' ? 'Main navigation' : 'Основная навигация');
    document.querySelectorAll('.language-options').forEach(options => options.setAttribute('aria-label', text.language));
    document.querySelector('.ticker')?.setAttribute('aria-label', text.tickerLabel);
    const tickerTrack = document.getElementById('ticker-track');
    if (tickerTrack) tickerTrack.replaceChildren(...[0, 1].map(() => {
      const message = document.createElement('span');
      message.textContent = text.ticker;
      return message;
    }));
    document.querySelectorAll('.brand').forEach(brand => brand.setAttribute('aria-label', text.brand));
    document.querySelector('.shared-footer-stats')?.setAttribute('aria-label', text.statsLabel);
    document.querySelector('[data-notifications-open]')?.setAttribute('aria-label', text.notifications);
    document.querySelector('#favorites-toggle')?.setAttribute('aria-label', text.favorites);
    document.querySelector('#cart-open')?.setAttribute('aria-label', text.cart);
    document.querySelector('#auth-open')?.setAttribute('aria-label', text.account);
    const accountLabel = document.querySelector('#auth-open .account-label');
    if (accountLabel) accountLabel.textContent = text.account;
    const balanceLabel = document.getElementById('balance-label');
    if (balanceLabel) {
      let balance = 0;
      try {
        balance = Number(JSON.parse(localStorage.getItem('dz-balance') || '0'));
      } catch (error) {
        console.error('Unable to read the saved balance for the header.', error);
      }
      balanceLabel.textContent = `${text.balance} ${Number.isFinite(balance) ? balance.toLocaleString(language === 'ka' ? 'ka-GE' : language === 'ru' ? 'ru-RU' : 'en-US') : 0} ${language === 'en' ? 'GEL' : '₾'}`;
      document.querySelector('[data-open-balance]')?.setAttribute('aria-label', balanceLabel.textContent);
    }
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) menuToggle.setAttribute('aria-label', menuToggle.getAttribute('aria-expanded') === 'true' ? text.close : text.open);
    const footerBrand = document.querySelector('.shared-footer-brand > p');
    if (footerBrand) footerBrand.innerHTML = text.footer;
    const stats = document.querySelectorAll('.shared-footer-stats div span');
    [text.active, text.secure, text.delivery].forEach((label, index) => { if (stats[index]) stats[index].textContent = label; });
    const groups = document.querySelectorAll('.footer-links');
    const footerLabels = [
      [text.nav[0], text.nav[3], text.nav[2], text.nav[4], text.nav[5]],
      [text.terms, text.refund, text.privacy]
    ];
    groups.forEach((group, index) => {
      const heading = group.querySelector('strong');
      if (heading) heading.textContent = index === 0 ? text.discover : text.information;
      group.querySelectorAll('a').forEach((link, linkIndex) => {
        if (footerLabels[index]?.[linkIndex]) link.textContent = footerLabels[index][linkIndex];
      });
    });
    const socialHeading = document.querySelector('.social-links > strong');
    if (socialHeading) socialHeading.textContent = text.follow;
    const footerNote = document.querySelector('.footer-bottom span:nth-child(2)');
    if (footerNote) footerNote.textContent = text.footerNote;
    document.querySelector('.back-to-top')?.setAttribute('aria-label', text.top);
    if (!hasApp) document.title = pageTextTranslations.get(initialPageTitle)?.[language] || initialPageTitle;
    translateStaticPage(language);
  }
  applySharedLanguage(savedLanguage);
  watchStaticPage();
  document.addEventListener('click', event => {
    const languageTrigger = event.target.closest('[data-language-trigger]');
    if (languageTrigger) {
      const switcher = languageTrigger.closest('.language-switcher');
      setLanguageSwitcherOpen(!switcher?.classList.contains('is-open'), switcher);
      return;
    }

    const languageButton = event.target.closest('[data-language]');
    if (languageButton) {
      const language = languageButton.dataset.language;
      if (['ka', 'en', 'ru'].includes(language)) {
        try {
          localStorage.setItem('dz-language', JSON.stringify(language));
        } catch (error) {
          console.error('Unable to save the language preference.', error);
        }
        applySharedLanguage(language);
        setLanguageSwitcherOpen(false);
      }
      return;
    }

    setLanguageSwitcherOpen(false);
    const toggle = event.target.closest('#menu-toggle');
    if (toggle && !hasApp) {
      const navigation = document.getElementById('primary-navigation');
      const isOpen = navigation.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'მენიუს დახურვა' : 'მენიუს გახსნა');
      return;
    }

    const action = event.target.closest('[data-shared-action]');
    if (action && !hasApp) {
      event.preventDefault();
      const destination = new URL('index.html', root);
      destination.searchParams.set('open', action.dataset.sharedAction);
      location.assign(destination.href);
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const openSwitcher = document.querySelector('.language-switcher.is-open');
    if (!openSwitcher) return;
    setLanguageSwitcherOpen(false);
    openSwitcher.querySelector('[data-language-trigger]')?.focus();
  });
})();
