const yearElement = document.getElementById('year');
const statusElement = document.getElementById('status');
const sendButton = document.getElementById('sendBtn');
const openPopupButton = document.getElementById('openPopup');
const closePopupButton = document.getElementById('closePopup');
const popupCtaButton = document.getElementById('popupCta');
const promoModal = document.getElementById('promoModal');

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (sendButton && statusElement) {
  sendButton.addEventListener('click', () => {
    statusElement.textContent = 'Tak! Vi kontakter jer hurtigst muligt med en demo.';
  });
}

function openModal() {
  if (!promoModal) return;
  promoModal.classList.add('show');
  promoModal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  if (!promoModal) return;
  promoModal.classList.remove('show');
  promoModal.setAttribute('aria-hidden', 'true');
}

if (openPopupButton) {
  openPopupButton.addEventListener('click', openModal);
}

if (closePopupButton) {
  closePopupButton.addEventListener('click', closeModal);
}

if (promoModal) {
  promoModal.addEventListener('click', (event) => {
    if (event.target === promoModal) {
      closeModal();
    }
  });
}

if (popupCtaButton) {
  popupCtaButton.addEventListener('click', () => {
    closeModal();
    if (statusElement) {
      statusElement.textContent = 'Popup-flow aktiveret: Du kan nu opsætte kampagner til besøgende.';
    }
  });
}
