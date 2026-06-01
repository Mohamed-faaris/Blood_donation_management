/* ─── Auth Page JS ───────────────────────────────────────── */
/* Backend returns: { accessToken: string, user: UserObject } */

let currentRole = 'donor';
let currentDonorMode = 'login';

function switchRole(role) {
  currentRole = role;
  ['hospital', 'donor'].forEach(r => {
    document.getElementById(`tab-${r}`)?.classList.toggle('active', r === role);
    document.getElementById(`panel-${r}`)?.classList.toggle('active', r === role);
  });
}

function setDonorMode(mode) {
  currentDonorMode = mode;
  document.getElementById('mode-login')?.classList.toggle('active', mode === 'login');
  document.getElementById('mode-register')?.classList.toggle('active', mode === 'register');
  const loginF = document.getElementById('donor-login-form');
  const regF   = document.getElementById('donor-register-form');
  const title  = document.getElementById('donor-title');
  const sub    = document.getElementById('donor-sub');
  if (mode === 'login') {
    if (loginF) loginF.style.display = '';
    if (regF)   regF.style.display   = 'none';
    if (title)  title.textContent    = 'Donor Login';
    if (sub)    sub.textContent      = 'Welcome back! Sign in to manage your donations.';
  } else {
    if (loginF) loginF.style.display = 'none';
    if (regF)   regF.style.display   = '';
    if (title)  title.textContent    = 'Register as Donor';
    if (sub)    sub.textContent      = 'Create your donor account to get started.';
  }
}

function showAlert(containerId, msg, type = 'error') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
}
function clearAlert(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '';
}

/* ─── Shared login handler ──────────────────────────────── */
async function doLogin(email, password, alertId, submitId, expectedRole) {
  clearAlert(alertId);
  setButtonLoading(submitId, true);

  const res = await API.auth.login({ email, password });
  setButtonLoading(submitId, false);

  if (!res.ok) {
    const msg = res.data?.message || 'Login failed. Check your credentials.';
    showAlert(alertId, Array.isArray(msg) ? msg.join(' · ') : msg);
    return;
  }

  // Backend shape: { accessToken, user }
  const token = res.data.accessToken;
  const user  = res.data.user;

  if (!token || !user) {
    showAlert(alertId, 'Unexpected server response. Please try again.');
    return;
  }

  if (user.role !== 'admin' && user.role !== expectedRole) {
    showAlert(alertId, `This account is a <strong>${user.role}</strong>. Please use the correct login tab.`);
    return;
  }

  Auth.setToken(token);
  Auth.setUser(user);
  showToast(`Welcome${user.fullName ? ', ' + user.fullName : ''}!`, 'success');
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 700);
}

/* ─── Hospital Login ────────────────────────────────────── */
async function handleHospitalLogin(e) {
  e.preventDefault();
  await doLogin(
    document.getElementById('hospital-email').value.trim(),
    document.getElementById('hospital-password').value,
    'hospital-alert',
    'hospital-submit',
    'hospital'
  );
}

/* ─── Donor Login ───────────────────────────────────────── */
async function handleDonorLogin(e) {
  e.preventDefault();
  await doLogin(
    document.getElementById('donor-email').value.trim(),
    document.getElementById('donor-password').value,
    'donor-alert',
    'donor-login-submit',
    'donor'
  );
}

/* ─── Donor Register ────────────────────────────────────── */
async function handleDonorRegister(e) {
  e.preventDefault();
  clearAlert('donor-alert');

  const name    = document.getElementById('reg-name').value.trim();
  const phone   = document.getElementById('reg-phone').value.trim();
  const email   = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;

  if (password !== confirm) { showAlert('donor-alert', 'Passwords do not match.'); return; }
  if (password.length < 6)  { showAlert('donor-alert', 'Password must be at least 6 characters.'); return; }

  const payload = { fullName: name, email, password, role: 'donor' };
  if (phone) payload.phone = phone;

  setButtonLoading('donor-reg-submit', true);
  const res = await API.auth.register(payload);
  setButtonLoading('donor-reg-submit', false);

  if (!res.ok) {
    const msg = res.data?.message || 'Registration failed.';
    showAlert('donor-alert', Array.isArray(msg) ? msg.join(' · ') : msg);
    return;
  }

  // Auto-login after register
  const token = res.data.accessToken;
  const user  = res.data.user;
  if (token && user) {
    Auth.setToken(token);
    Auth.setUser(user);
    showToast('Account created! Redirecting…', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
  } else {
    showAlert('donor-alert', '✅ Account created successfully! Please sign in.', 'success');
    setTimeout(() => setDonorMode('login'), 1500);
  }
}
