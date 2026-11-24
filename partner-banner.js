(() => {
  const modal = document.getElementById('partner-modal');
  const trigger = document.querySelector('[data-partner-modal-open]');
  const title = document.getElementById('partner-banner-title');
  const description = document.getElementById('partner-banner-description');
  const logo = document.getElementById('partner-modal-logo');
  const bannerLogo = document.querySelector('.partner-banner-logo');
  const websiteLink = document.getElementById('partner-website-link');
  const defaultName = 'უცხო ენების უმაღლესი სკოლა „ნინო“';
  let returnFocus = null;

  if (!modal || !trigger || !title || !description || !logo || !websiteLink) return;

  function safeExternalUrl(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    try {
      const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function updatePartner(config) {
    const name = String(config.partnerName || defaultName);
    title.textContent = name;
    description.textContent = String(config.partnerDescription || 'მადლობა მხარდაჭერისა და პარტნიორობისთვის.');
    const logoUrl = String(config.partnerLogoUrl || 'assets/nino-school-logo.png');
    logo.src = logoUrl;
    logo.alt = `${name} — ლოგო`;
    if (bannerLogo) {
      bannerLogo.src = logoUrl;
      bannerLogo.alt = `${name} — ლოგო`;
    }

    const websiteUrl = safeExternalUrl(config.partnerWebsiteUrl);
    if (websiteUrl) {
      websiteLink.href = websiteUrl;
      websiteLink.hidden = false;
    } else {
      websiteLink.removeAttribute('href');
      websiteLink.hidden = true;
    }
  }

  trigger.addEventListener('click', () => {
    returnFocus = trigger;
    modal.showModal();
    document.body.classList.add('partner-modal-open');
    modal.querySelector('[data-partner-modal-close]')?.focus();
  });

  modal.addEventListener('click', event => {
    if (event.target === modal) modal.close();
  });

  modal.addEventListener('close', () => {
    document.body.classList.remove('partner-modal-open');
    returnFocus?.focus();
  });

  modal.querySelectorAll('[data-partner-modal-close]').forEach(button => {
    button.addEventListener('click', () => modal.close());
  });

  const api = window.DropZoneFirebase;
  if (api?.subscribeSiteConfig) {
    api.subscribeSiteConfig(updatePartner, error => {
      console.error('Unable to load public partner configuration for the partner banner.', error);
    });
  }
})();
