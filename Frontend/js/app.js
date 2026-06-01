/* ─── App Layout / Sidebar JS ─────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  initSidebar();
  hideSidebarItemsByRole();
});

function hideSidebarItemsByRole() {
  const role = Auth.getRole();
  const user = Auth.getUser();

  // Role-based nav visibility
  const adminOnly = document.querySelectorAll('[data-role="admin"]');
  const hospitalAndAdmin = document.querySelectorAll('[data-role="admin,hospital"]');
  const donorOnly = document.querySelectorAll('[data-role="donor"]');

  adminOnly.forEach(el => {
    if (role !== 'admin') el.style.display = 'none';
  });
  hospitalAndAdmin.forEach(el => {
    if (!['admin', 'hospital'].includes(role)) el.style.display = 'none';
  });
  donorOnly.forEach(el => {
    if (role !== 'donor') el.style.display = 'none';
  });
}
