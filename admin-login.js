(() => {
  const api = window.DropZoneAdminApi;
  const form = document.getElementById('admin-login-form');
  const message = document.getElementById('admin-login-message');
  const supportedLanguages = ['ka', 'en', 'ru'];
  const copy = {
    ka: {
      eyebrow: 'ADMIN / უსაფრთხო წვდომა',
      title: 'ადმინისტრატორის შესვლა',
      description: 'შეიყვანე ადმინისტრატორის PIN პანელში შესასვლელად.',
      pinLabel: 'PIN კოდი',
      submit: 'შესვლა',
      kicker: ['DROPZONE / MANAGEMENT', 'ADMIN / PIN'],
      checking: 'PIN მოწმდება…',
      required: 'შეიყვანე ადმინისტრატორის PIN.',
      invalidPin: 'PIN არასწორია. სცადე ხელახლა.',
      rateLimited: 'PIN-ის მცდელობების ლიმიტი ამოიწურა. სცადე 15 წუთის შემდეგ.',
      unavailable: 'ადმინისტრატორის შესვლა ამჟამად მიუწვდომელია. სცადე მოგვიანებით.',
      expired: 'PIN სესია დასრულდა. გასაგრძელებლად შეიყვანე PIN ხელახლა.'
    },
    en: {
      eyebrow: 'ADMIN / SECURE ACCESS',
      title: 'Administrator sign in',
      description: 'Enter the administrator PIN to access the dashboard.',
      pinLabel: 'PIN code',
      submit: 'Sign in',
      kicker: ['DROPZONE / MANAGEMENT', 'ADMIN / PIN'],
      checking: 'Verifying PIN…',
      required: 'Enter the administrator PIN.',
      invalidPin: 'Incorrect PIN. Please try again.',
      rateLimited: 'Too many PIN attempts. Try again in 15 minutes.',
      unavailable: 'Administrator sign in is currently unavailable. Try again later.',
      expired: 'Your PIN session has expired. Enter the PIN again to continue.'
    },
    ru: {
      eyebrow: 'АДМИН / БЕЗОПАСНЫЙ ДОСТУП',
      title: 'Вход администратора',
      description: 'Введите PIN-код администратора для доступа к панели.',
      pinLabel: 'PIN-код',
      submit: 'Войти',
      kicker: ['DROPZONE / УПРАВЛЕНИЕ', 'АДМИН / PIN'],
      checking: 'Проверка PIN-кода…',
      required: 'Введите PIN-код администратора.',
      invalidPin: 'Неверный PIN-код. Попробуйте ещё раз.',
      rateLimited: 'Превышено число попыток. Попробуйте снова через 15 минут.',
      unavailable: 'Вход администратора временно недоступен. Попробуйте позже.',
      expired: 'Срок действия PIN-сессии истёк. Введите PIN-код ещё раз.'
    }
  };
  let language = 'ka';

  function applyLanguage() {
    const text = copy[language];
    document.documentElement.lang = language;
    document.title = `${text.title} | DropZone Market`;
    document.querySelectorAll('[data-login-copy]').forEach(element => {
      element.textContent = text[element.dataset.loginCopy];
    });
    document.querySelectorAll('.admin-pin-page .page-kicker span').forEach((element, index) => {
      element.textContent = text.kicker[index] || element.textContent;
    });
    document.querySelectorAll('[data-language]').forEach(button => {
      button.classList.toggle('is-active', button.dataset.language === language);
    });
    if (new URLSearchParams(location.search).has('expired')) message.textContent = text.expired;
  }

  try {
    const savedLanguage = JSON.parse(localStorage.getItem('dz-language') || '"ka"');
    language = supportedLanguages.includes(savedLanguage) ? savedLanguage : 'ka';
  } catch (error) {
    console.error('Unable to read the saved language preference.', error);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-language]');
    if (!button || !supportedLanguages.includes(button.dataset.language)) return;
    language = button.dataset.language;
    applyLanguage();
  });
  applyLanguage();

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const pin = String(new FormData(form).get('pin') || '');
    if (!pin) {
      message.textContent = copy[language].required;
      return;
    }
    if (!api) {
      message.textContent = copy[language].unavailable;
      return;
    }

    button.disabled = true;
    message.textContent = copy[language].checking;
    try {
      await api.login(pin);
      form.reset();
      location.replace('admin.html');
    } catch (error) {
      console.error('Admin PIN verification failed.', error.code || 'admin_api_failed');
      message.textContent = error.code === 'invalid_pin' ? copy[language].invalidPin
        : error.code === 'pin_rate_limited' ? copy[language].rateLimited
          : copy[language].unavailable;
      form.elements.pin.focus();
      form.elements.pin.select();
    } finally {
      button.disabled = false;
    }
  });

  if (api) {
    api.getSession().then(result => {
      if (result.authenticated) location.replace('admin.html');
    }).catch(error => {
      console.error('Unable to check the administrator session.', error);
      message.textContent = error.message || copy[language].unavailable;
    });
  } else {
    message.textContent = copy[language].unavailable;
  }
})();
