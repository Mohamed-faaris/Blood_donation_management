let currentUser = null;

async function initDashboard() {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'auth.html';

    try {
        currentUser = await api.get('/auth/me');
        document.getElementById('user-display-name').innerText = currentUser.fullName || currentUser.email.split('@')[0];
        document.getElementById('user-role-badge').innerText = currentUser.role.toUpperCase();

        setupRoleAccess();
        switchView('overview');
    } catch (err) {
        logout();
    }
}

function setupRoleAccess() {
    const role = currentUser.role;
    if (role !== 'admin') {
        if (document.getElementById('nav-donors')) document.getElementById('nav-donors').style.display = 'none';
        if (document.getElementById('nav-inventory')) document.getElementById('nav-inventory').style.display = 'none';
        if (document.getElementById('overview-stats')) document.getElementById('overview-stats').style.display = 'none';
    }
}

function switchView(viewName) {
    document.querySelectorAll('.view-content').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(v => v.classList.remove('active'));

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add('active');

    document.getElementById('view-title').innerText = viewName.charAt(0).toUpperCase() + viewName.slice(1);

    const activeNav = [...document.querySelectorAll('.nav-item')].find(n => n.innerText.toLowerCase().includes(viewName) || n.id === `nav-${viewName}`);
    if (activeNav) activeNav.classList.add('active');

    loadViewData(viewName);
}

async function loadViewData(view) {
    try {
        if (view === 'overview') {
            if (currentUser.role === 'admin') {
                const stats = await api.get('/dashboard/stats');
                document.getElementById('total-donors').innerText = stats.totalDonors || 0;
                document.getElementById('total-units').innerText = stats.totalInventoryUnits || 0;
                document.getElementById('total-camps').innerText = stats.activeCamps || 0;
            }
            const appts = await api.get(`/appointments/donor/${currentUser.id}`);
            document.getElementById('recent-list').innerHTML = appts.map(a => `<div style="padding:10px; border-bottom:1px solid #eee;">Donation Scheduled: ${new Date(a.date).toLocaleDateString()}</div>`).join('');
        }
        if (view === 'inventory') {
            const data = await api.get('/inventory');
            document.querySelector('#inventory-table tbody').innerHTML = data.map(i => `<tr><td>${i.bloodGroup}</td><td>${i.units}</td><td>${i.units > 0 ? 'Available' : 'Out'}</td></tr>`).join('');
        }
        if (view === 'camps') {
            const data = await api.get('/camps/upcoming');
            document.getElementById('dashboard-camp-list').innerHTML = data.map(c => `<div class="card" style="margin-bottom:10px;">${c.name} - ${c.location}</div>`).join('');
        }
    } catch (e) { console.error(e); }
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function logout() { localStorage.removeItem('token'); window.location.href = 'index.html'; }

initDashboard();
