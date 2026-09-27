const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');

function closeMenu() {
  if (!toggle || !nav) return;
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', event => {
    if (!nav.classList.contains('is-open')) return;
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.style.boxShadow = window.scrollY > 18 ? '0 10px 28px rgba(0,0,0,.16)' : 'none';
}, { passive: true });


const directForms = document.querySelectorAll('.club-contact-form, .player-interest-form');

directForms.forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();

    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');

    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) {
        status.textContent = 'Please complete all required fields and check the consent box.';
        status.classList.add('is-error');
      }
      return;
    }

    const originalText = button ? button.textContent : '';

    if (status) {
      status.textContent = 'Sending your message…';
      status.classList.remove('is-error');
    }

    if (button) {
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.textContent = 'Sending…';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Submission failed');
      }

      window.location.href = 'thanks.html';
    } catch (error) {
      if (status) {
        status.textContent = 'Your message could not be sent. Please try again or email info@saratogacontinentalsfc.com.';
        status.classList.add('is-error');
      }
      if (button) {
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.textContent = originalText;
      }
    }
  });
});


const playerAge = document.getElementById('player-age');
const submitterRole = document.getElementById('submitter-role');
const minorFields = document.getElementById('minor-fields');
const guardianName = document.getElementById('guardian-name');
const guardianRelationship = document.getElementById('guardian-relationship');
const under13Attestation = document.getElementById('under13-attestation');
const under13Confirm = document.getElementById('under13-confirm');

function updateMinorFields() {
  if (!playerAge || !minorFields) return;

  const age = Number(playerAge.value);
  const isMinor = Number.isFinite(age) && age > 0 && age < 18;
  const isUnder13 = Number.isFinite(age) && age > 0 && age < 13;

  minorFields.hidden = !isMinor;

  if (guardianName) guardianName.required = isMinor;
  if (guardianRelationship) guardianRelationship.required = isMinor;

  if (under13Attestation) under13Attestation.hidden = !isUnder13;
  if (under13Confirm) {
    under13Confirm.required = isUnder13;
    if (!isUnder13) under13Confirm.checked = false;
  }

  if (submitterRole) {
    const adultPlayerSelected = submitterRole.value === 'Adult Player';
    if (isMinor && adultPlayerSelected) {
      submitterRole.setCustomValidity('A minor player form must be submitted by a parent, legal guardian, or authorized adult.');
    } else if (!isMinor && submitterRole.value && !adultPlayerSelected) {
      submitterRole.setCustomValidity('For a player age 18 or older, choose Adult player (18+).');
    } else {
      submitterRole.setCustomValidity('');
    }
  }
}

[playerAge, submitterRole].forEach(el => {
  if (el) {
    el.addEventListener('input', updateMinorFields);
    el.addEventListener('change', updateMinorFields);
  }
});

updateMinorFields();
