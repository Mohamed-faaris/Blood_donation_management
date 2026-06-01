/* ─── Sidebar Template ────────────────────────────────────── */
/* Called by each page's inline script */
function renderSidebar(activePage) {
  const role = Auth.getRole();
  const isAdmin = role === 'admin';
  const isHospital = role === 'hospital';
  const isDonor = role === 'donor';

  const navItems = [
    // All roles
    { href: 'dashboard.html', icon: '📊', label: 'Dashboard', roles: ['admin', 'hospital', 'donor'] },
    // Admin + Hospital
    { href: 'inventory.html', icon: '🩸', label: 'Blood Inventory', roles: ['admin', 'hospital'] },
    { href: 'requests.html', icon: '📋', label: 'Blood Requests', roles: ['admin', 'hospital'] },
    { href: 'camps.html', icon: '🏕️', label: 'Donation Camps', roles: ['admin', 'hospital'] },
    // Admin only section
    { section: 'Donor Management', roles: ['admin', 'hospital'] },
    { href: 'donors.html', icon: '👤', label: 'Donors', roles: ['admin', 'hospital'] },
    { href: 'donations.html', icon: '💉', label: 'Donations', roles: ['admin'] },
    { href: 'appointments.html', icon: '📅', label: 'Appointments', roles: ['admin'] },
    { href: 'eligibility.html', icon: '✅', label: 'Eligibility', roles: ['admin'] },
    { section: 'Operations', roles: ['admin'] },
    { href: 'hospitals.html', icon: '🏥', label: 'Hospitals', roles: ['admin'] },
    { href: 'users.html', icon: '👥', label: 'Users & Roles', roles: ['admin'] },
    { href: 'notifications.html', icon: '🔔', label: 'Notifications', roles: ['admin'] },
    // Donor section
    { section: 'My Account', roles: ['donor'] },
    { href: 'my-appointments.html', icon: '📅', label: 'My Appointments', roles: ['donor'] },
    { href: 'my-donations.html', icon: '💉', label: 'My Donations', roles: ['donor'] },
    { href: 'my-notifications.html', icon: '🔔', label: 'Notifications', roles: ['donor'], badge: true },
    { href: 'my-requests.html', icon: '📋', label: 'Blood Requests', roles: ['donor'] },
    { href: 'eligibility.html', icon: '✅', label: 'Eligibility Check', roles: ['donor'] },
    { href: 'profile.html', icon: '⚙️', label: 'My Profile', roles: ['donor'] },
  ];

  let html = '';
  for (const item of navItems) {
    if (!item.roles.includes(role)) continue;
    if (item.section) {
      html += `<div class="nav-section-label">${item.section}</div>`;
      continue;
    }
    const isActive = activePage === item.href ? 'active' : '';
    const badge = item.badge ? `<span class="nav-badge" id="notif-count" style="display:none">0</span>` : '';
    html += `<a href="${item.href}" class="nav-item ${isActive}">
      <span class="nav-icon">${item.icon}</span>
      ${item.label}${badge}
    </a>`;
  }

  const sidebarEl = document.getElementById('sidebar-nav');
  if (sidebarEl) sidebarEl.innerHTML = html;
}
