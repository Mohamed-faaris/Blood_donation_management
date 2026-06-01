/* ─── Layout Builder ──────────────────────────────────────── */
/* Injects sidebar + topbar into .app-layout pages */

function buildLayout(config = {}) {
  const {
    activePage = '',
    pageTitle = 'Dashboard',
    breadcrumb = '',
    headerActions = '',
  } = config;

  // Inject sidebar structure
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sidebar-logo">
        <div class="logo-icon">🩸</div>
        <div class="logo-text">LifePulse <span>Blood Management</span></div>
      </div>
      <nav class="sidebar-nav" id="sidebar-nav"></nav>
      <div class="sidebar-footer">
        <div class="sidebar-user" onclick="handleLogout()">
          <div class="user-avatar" id="sidebar-avatar">?</div>
          <div class="user-info">
            <div class="user-name" id="sidebar-user-name">Loading…</div>
            <div class="user-role" id="sidebar-user-role"></div>
          </div>
          <span style="color:var(--gray-400); font-size:0.8rem;">↪</span>
        </div>
      </div>`;
  }

  // Inject topbar
  const topbar = document.getElementById('topbar');
  if (topbar) {
    topbar.innerHTML = `
      <div class="topbar-left">
        <button class="menu-toggle" id="menu-toggle">☰</button>
        <div>
          <div class="page-title">${pageTitle}</div>
          ${breadcrumb ? `<div class="breadcrumb">${breadcrumb}</div>` : ''}
        </div>
      </div>
      <div class="topbar-right">
        <div class="topbar-search">
          <span>🔍</span>
          <input type="text" id="global-search" placeholder="Search…">
        </div>
        <button class="topbar-btn" onclick="window.location.href='notifications.html'" title="Notifications">
          🔔<span class="topbar-notif-count" id="topbar-notif" style="display:none">0</span>
        </button>
        <button class="topbar-btn" onclick="window.location.href='profile.html'" title="Profile">👤</button>
      </div>`;
  }

  // Init sidebar nav
  renderSidebar(activePage);

  // Init sidebar behavior
  initSidebar();

  // Role-based adjustments
  adjustForRole();
}

function adjustForRole() {
  const role = Auth.getRole();
  // Redirect hospital to inventory if they somehow reach admin pages
  if (role === 'hospital') {
    const page = window.location.pathname.split('/').pop();
    const hospitalForbidden = ['users.html', 'donors.html', 'donations.html'];
    if (hospitalForbidden.includes(page)) {
      showToast('Access denied', 'error');
      window.location.href = 'dashboard.html';
    }
  }
}
