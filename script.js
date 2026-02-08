const STORAGE_KEY = 'proudcph-payment-methods';
const yearElements = document.querySelectorAll('#year');
const statusElement = document.getElementById('status');
const sendButton = document.getElementById('sendBtn');

const paymentForm = document.getElementById('paymentForm');
const paymentNameInput = document.getElementById('paymentName');
const paymentStatus = document.getElementById('paymentStatus');

const adminList = document.getElementById('paymentMethodsAdmin');
const checkoutList = document.getElementById('paymentMethodsCheckout');
const previewList = document.getElementById('paymentMethodsPreview');

const defaultMethods = ['Visa / Mastercard', 'MobilePay', 'Klarna'];

function getStoredMethods() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMethods));
    return [...defaultMethods];
  }

  try {
    const methods = JSON.parse(stored);
    return Array.isArray(methods) ? methods : [...defaultMethods];
  } catch {
    return [...defaultMethods];
  }
}

function setStoredMethods(methods) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(methods));
}

function renderMethods(listElement, methods, showRemove = false) {
  if (!listElement) return;
  listElement.innerHTML = '';

  methods.forEach((method, index) => {
    const item = document.createElement('li');
    item.className = 'method-item';

    const label = document.createElement('span');
    label.textContent = method;
    item.appendChild(label);

    if (showRemove) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.type = 'button';
      removeBtn.textContent = 'Fjern';
      removeBtn.addEventListener('click', () => {
        const methodsNow = getStoredMethods();
        methodsNow.splice(index, 1);
        setStoredMethods(methodsNow);
        syncPaymentUI();
      });
      item.appendChild(removeBtn);
    }

    listElement.appendChild(item);
  });

  if (!methods.length) {
    const empty = document.createElement('li');
    empty.className = 'method-item';
    empty.textContent = 'Ingen betalingsmetoder endnu.';
    listElement.appendChild(empty);
  }
}

function syncPaymentUI() {
  const methods = getStoredMethods();
  renderMethods(adminList, methods, true);
  renderMethods(checkoutList, methods, false);
  renderMethods(previewList, methods, false);
}

yearElements.forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

if (sendButton && statusElement) {
  sendButton.addEventListener('click', () => {
    statusElement.textContent = 'Tak! Team Proud Cph kontakter dig inden for 24 timer.';
  });
}

if (paymentForm && paymentNameInput) {
  paymentForm.addEventListener('submit', () => {
    const methodName = paymentNameInput.value.trim();

    if (!methodName) {
      if (paymentStatus) paymentStatus.textContent = 'Skriv et navn på betalingsmetoden.';
      return;
    }

    const methods = getStoredMethods();
    methods.push(methodName);
    setStoredMethods(methods);
    paymentNameInput.value = '';
    if (paymentStatus) paymentStatus.textContent = `Tilføjet: ${methodName}`;
    syncPaymentUI();
  });
}

syncPaymentUI();
