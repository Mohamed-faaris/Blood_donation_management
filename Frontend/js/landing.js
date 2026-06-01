/* ─── Landing Page JS ─────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', async () => {
  // Scroll nav
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('landingNav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // API health check
  const pill = document.getElementById('api-pill');
  try {
    const res = await fetch('http://localhost:3000/api/dashboard/stats', { method: 'GET' });
    if (res.ok || res.status === 401) {
      if (pill) { pill.textContent = '⬤ API Online'; pill.className = 'api-pill online'; }
    } else { throw new Error(); }
  } catch {
    if (pill) { pill.textContent = '⬤ API Offline'; pill.className = 'api-pill offline'; }
  }

  // If already logged in, redirect to dashboard
  if (Auth.isLoggedIn()) {
    const role = Auth.getRole();
    // Could redirect but let them stay on landing
  }

  // Load stats
  loadHeroStats();

  // Load inventory
  loadPublicInventory();

  // Load donors (initial)
  searchPublicDonors();

  // Load camps
  loadPublicCamps();
});

async function loadHeroStats() {
  const res = await API.dashboard.getStats().catch(() => null);
  if (res?.ok && res.data) {
    const s = res.data;
    setText('hero-donors', s.totalDonors ?? s.donors ?? '—');
    setText('hero-donations', s.totalDonations ?? s.donations ?? '—');
    setText('hero-camps', s.totalCamps ?? s.camps ?? '—');
    setText('hero-hospitals', s.totalHospitals ?? s.hospitals ?? '—');
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

async function loadPublicInventory() {
  const container = document.getElementById('public-inventory');
  if (!container) return;
  const res = await API.inventory.findAll();
  if (!res.ok) { container.innerHTML = emptyState('❌', 'Unable to load', 'Backend may be offline.'); return; }
  const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
  if (!items.length) { container.innerHTML = emptyState('📦', 'No inventory data', ''); return; }
  container.innerHTML = items.map(item => {
    const pct = Math.min(100, ((item.units || 0) / 100) * 100);
    let statusClass = 'green', statusLabel = 'Available';
    if (item.status === 'low' || (item.units || 0) < 10) { statusClass = 'yellow'; statusLabel = 'Low Stock'; }
    if (item.status === 'expired' || (item.units || 0) === 0) { statusClass = 'red'; statusLabel = 'Critical'; }
    return `
      <div class="inv-public-card">
        <div class="inv-bg-circle">${item.bloodGroup}</div>
        <div class="inv-units">${item.units ?? 0}</div>
        <div class="inv-label">Units Available</div>
        <div class="inv-status">${statusBadge(statusLabel.toLowerCase())}</div>
        <div class="inventory-bar-track" style="margin-top:10px;">
          <div class="inventory-bar-fill bar-${statusClass}" style="width:${pct}%"></div>
        </div>
      </div>`;
  }).join('');
}

async function loadPublicCamps() {
  const container = document.getElementById('public-camps');
  if (!container) return;
  const res = await API.camps.findUpcoming();
  if (!res.ok) { container.innerHTML = emptyState('❌', 'Unable to load', ''); return; }
  const camps = Array.isArray(res.data) ? res.data : (res.data?.data || []);
  if (!camps.length) { container.innerHTML = emptyState('🏕️', 'No upcoming camps', 'Check back soon!'); return; }
  container.innerHTML = camps.map(c => `
    <div class="camp-pub-card">
      <h4>${c.name || c.campName || 'Camp'}</h4>
      <div class="camp-meta">📅 ${formatDate(c.date || c.scheduledDate)}</div>
      <div class="camp-meta">📍 ${c.location || c.address || '—'}</div>
      <div class="camp-meta">🏥 ${c.organizer || c.organizerName || '—'}</div>
      ${c.expectedDonors ? `<div class="camp-meta">👥 Expected: ${c.expectedDonors} donors</div>` : ''}
      <div style="margin-top:10px;">${statusBadge(c.status)}</div>
    </div>`).join('');
}
