const STORAGE_KEY = 'proudcph-payment-methods';
const EMPLOYEE_AUTH_KEY = 'proudcph-employee-auth';
const EMPLOYEE_ORDERS_KEY = 'proudcph-orders';
const EMPLOYEE_MAIL_LOG_KEY = 'proudcph-mail-log';
const EMPLOYEE_NOTIFY_EMAIL_KEY = 'proudcph-notify-email';
const DEMO_EMPLOYEE_EMAIL = 'staff@proudcph.com';
const DEMO_EMPLOYEE_PASSWORD = 'Proud2026!';

const yearElements = document.querySelectorAll('#year');
const statusElement = document.getElementById('status');
const sendButton = document.getElementById('sendBtn');

const paymentForm = document.getElementById('paymentForm');
const paymentNameInput = document.getElementById('paymentName');
const paymentStatus = document.getElementById('paymentStatus');
const adminList = document.getElementById('paymentMethodsAdmin');
const checkoutList = document.getElementById('paymentMethodsCheckout');
const previewList = document.getElementById('paymentMethodsPreview');

const employeeLoginCard = document.getElementById('employeeLoginCard');
const employeeDashboard = document.getElementById('employeeDashboard');
const employeeLoginForm = document.getElementById('employeeLoginForm');
const employeeEmail = document.getElementById('employeeEmail');
const employeePassword = document.getElementById('employeePassword');
const employeeLoginStatus = document.getElementById('employeeLoginStatus');
const employeeOrdersBody = document.getElementById('employeeOrdersBody');
const employeeMailLog = document.getElementById('employeeMailLog');
const employeeMailStatus = document.getElementById('employeeMailStatus');
const sendAllOrderMailsBtn = document.getElementById('sendAllOrderMailsBtn');
const employeeLogoutBtn = document.getElementById('employeeLogoutBtn');
const notifyEmailForm = document.getElementById('notifyEmailForm');
const notifyEmailInput = document.getElementById('notifyEmailInput');
const notifyEmailStatus = document.getElementById('notifyEmailStatus');
const placeDemoOrderBtn = document.getElementById('placeDemoOrderBtn');
const orderStatus = document.getElementById('orderStatus');

const defaultMethods = ['Visa / Mastercard', 'MobilePay', 'Klarna'];
const defaultOrders = [
  { id: 'PCPH-1001', customer: 'Nadia Jensen', email: 'nadia@example.com', total: '1.699 DKK', status: 'Betalt', emailed: false },
  { id: 'PCPH-1002', customer: 'Jonas Madsen', email: 'jonas@example.com', total: '2.198 DKK', status: 'Pakker', emailed: false },
  { id: 'PCPH-1003', customer: 'Lina Sørensen', email: 'lina@example.com', total: '499 DKK', status: 'Afsendt', emailed: true }
];

function safeParse(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function getStoredMethods() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMethods));
    return [...defaultMethods];
  }
  const methods = safeParse(stored, defaultMethods);
  return Array.isArray(methods) ? methods : [...defaultMethods];
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

function getOrders() {
  const stored = localStorage.getItem(EMPLOYEE_ORDERS_KEY);
  if (!stored) {
    localStorage.setItem(EMPLOYEE_ORDERS_KEY, JSON.stringify(defaultOrders));
    return [...defaultOrders];
  }
  const parsed = safeParse(stored, defaultOrders);
  return Array.isArray(parsed) ? parsed : [...defaultOrders];
}

function setOrders(orders) {
  localStorage.setItem(EMPLOYEE_ORDERS_KEY, JSON.stringify(orders));
}

function getMailLog() {
  const stored = localStorage.getItem(EMPLOYEE_MAIL_LOG_KEY);
  const parsed = safeParse(stored, []);
  return Array.isArray(parsed) ? parsed : [];
}

function setMailLog(entries) {
  localStorage.setItem(EMPLOYEE_MAIL_LOG_KEY, JSON.stringify(entries));
}


function getNotifyEmail() {
  const stored = localStorage.getItem(EMPLOYEE_NOTIFY_EMAIL_KEY);
  if (!stored) {
    localStorage.setItem(EMPLOYEE_NOTIFY_EMAIL_KEY, 'ops@proudcph.com');
    return 'ops@proudcph.com';
  }
  return stored;
}

function setNotifyEmail(value) {
  localStorage.setItem(EMPLOYEE_NOTIFY_EMAIL_KEY, value);
}

function createDemoOrder() {
  const orders = getOrders();
  const nextIdNumber = 1000 + orders.length + 1;
  const newOrder = {
    id: `PCPH-${nextIdNumber}`,
    customer: 'Ny kunde',
    email: 'kunde@example.com',
    total: '1.299 DKK',
    status: 'Betalt',
    emailed: true
  };

  orders.unshift(newOrder);
  setOrders(orders);
  appendMailLog(newOrder);

  const notifyEmail = getNotifyEmail();
  const log = getMailLog();
  const timestamp = new Date().toLocaleString('da-DK');
  log.unshift(`${timestamp} · Intern notifikation sendt til ${notifyEmail} for ${newOrder.id}`);
  setMailLog(log.slice(0, 20));

  if (orderStatus) {
    orderStatus.textContent = `Ordre ${newOrder.id} oprettet. Mail sendt til kunde + ${notifyEmail}.`;
  }

  if (employeeMailStatus && isEmployeeLoggedIn()) {
    employeeMailStatus.textContent = `Ny ordre ${newOrder.id} notifikation sendt til ${notifyEmail}.`;
  }

  renderOrders();
  renderMailLog();
}

function isEmployeeLoggedIn() {
  return localStorage.getItem(EMPLOYEE_AUTH_KEY) === 'true';
}

function setEmployeeAuth(value) {
  localStorage.setItem(EMPLOYEE_AUTH_KEY, value ? 'true' : 'false');
}

function appendMailLog(order) {
  const log = getMailLog();
  const timestamp = new Date().toLocaleString('da-DK');
  log.unshift(`${timestamp} · Mail sendt for ${order.id} til ${order.email}`);
  setMailLog(log.slice(0, 20));
}

function renderMailLog() {
  if (!employeeMailLog) return;
  const log = getMailLog();
  employeeMailLog.innerHTML = '';

  if (!log.length) {
    const item = document.createElement('li');
    item.className = 'method-item';
    item.textContent = 'Ingen mails sendt endnu.';
    employeeMailLog.appendChild(item);
    return;
  }

  log.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'method-item';
    item.textContent = entry;
    employeeMailLog.appendChild(item);
  });
}

function sendOrderMail(orderId) {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return;

  orders[idx].emailed = true;
  setOrders(orders);
  appendMailLog(orders[idx]);

  if (employeeMailStatus) {
    employeeMailStatus.textContent = `Mail sendt for ordre ${orders[idx].id}.`;
  }

  renderOrders();
  renderMailLog();
}

function renderOrders() {
  if (!employeeOrdersBody) return;
  const orders = getOrders();
  employeeOrdersBody.innerHTML = '';

  orders.forEach((order) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer}</td>
      <td>${order.total}</td>
      <td>${order.status}</td>
      <td>
        <button class="remove-btn" type="button" data-order-mail="${order.id}" ${order.emailed ? 'disabled' : ''}>
          ${order.emailed ? 'Sendt' : 'Send mail'}
        </button>
      </td>
    `;
    employeeOrdersBody.appendChild(row);
  });

  employeeOrdersBody.querySelectorAll('[data-order-mail]').forEach((button) => {
    button.addEventListener('click', () => {
      const orderId = button.getAttribute('data-order-mail');
      if (orderId) sendOrderMail(orderId);
    });
  });
}

function updateEmployeeVisibility() {
  if (!employeeLoginCard || !employeeDashboard) return;
  const loggedIn = isEmployeeLoggedIn();
  employeeLoginCard.classList.toggle('hidden', loggedIn);
  employeeDashboard.classList.toggle('hidden', !loggedIn);

  if (loggedIn) {
    renderOrders();
    renderMailLog();
    if (notifyEmailInput) notifyEmailInput.value = getNotifyEmail();
  }
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

if (employeeLoginForm && employeeEmail && employeePassword) {
  employeeLoginForm.addEventListener('submit', () => {
    const email = employeeEmail.value.trim().toLowerCase();
    const password = employeePassword.value;

    if (email === DEMO_EMPLOYEE_EMAIL && password === DEMO_EMPLOYEE_PASSWORD) {
      setEmployeeAuth(true);
      employeeLoginStatus.textContent = 'Login lykkedes.';
      updateEmployeeVisibility();
    } else {
      employeeLoginStatus.textContent = 'Forkert login. Prøv igen.';
    }
  });
}

if (sendAllOrderMailsBtn) {
  sendAllOrderMailsBtn.addEventListener('click', () => {
    const unsent = getOrders().filter((order) => !order.emailed);
    unsent.forEach((order) => sendOrderMail(order.id));
    if (!unsent.length && employeeMailStatus) {
      employeeMailStatus.textContent = 'Alle ordremails er allerede sendt.';
    }
  });
}

if (employeeLogoutBtn) {
  employeeLogoutBtn.addEventListener('click', () => {
    setEmployeeAuth(false);
    if (employeeLoginStatus) employeeLoginStatus.textContent = '';
    updateEmployeeVisibility();
  });
}


if (notifyEmailForm && notifyEmailInput) {
  notifyEmailForm.addEventListener('submit', () => {
    const value = notifyEmailInput.value.trim().toLowerCase();
    if (!value.includes('@')) {
      if (notifyEmailStatus) notifyEmailStatus.textContent = 'Indtast en gyldig e-mail.';
      return;
    }
    setNotifyEmail(value);
    if (notifyEmailStatus) notifyEmailStatus.textContent = `Gemt: ${value}`;
  });
}

if (placeDemoOrderBtn) {
  placeDemoOrderBtn.addEventListener('click', createDemoOrder);
}

syncPaymentUI();
updateEmployeeVisibility();
