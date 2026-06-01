# 🩸 LifePulse — Blood Donation Management Frontend

A complete, professional frontend for the LifePulse Blood Donation Management System.
Built with pure HTML, CSS, and vanilla JavaScript — no framework dependencies.

---

## 📁 Directory Structure

```
Frontend/
├── index.html                   # Public landing page
├── css/
│   ├── main.css                 # Full design system (sidebar, tables, modals, forms…)
│   └── landing.css              # Landing page styles
├── js/
│   ├── api.js                   # Central API layer + Auth + utilities
│   ├── auth.js                  # Login/Register logic (3-role)
│   ├── landing.js               # Landing page data loading
│   ├── sidebar.js               # Dynamic role-aware sidebar builder
│   ├── layout.js                # Topbar + sidebar injection
│   └── app.js                   # Global init + route guard
└── pages/
    ├── login.html               # 3-role login (Admin / Hospital / Donor + Register)
    ├── dashboard.html           # Role-aware dashboard
    ├── donors.html              # Donor management (Admin)
    ├── donations.html           # Donation records + stats (Admin)
    ├── appointments.html        # Appointment scheduling (Admin)
    ├── inventory.html           # Blood inventory (Admin + Hospital)
    ├── requests.html            # Blood requests (Admin + Hospital)
    ├── hospitals.html           # Hospital management (Admin)
    ├── camps.html               # Donation camps (Admin + Hospital)
    ├── users.html               # User & role management (Admin)
    ├── eligibility.html         # Eligibility checks (All roles)
    ├── notifications.html       # Notification management (Admin)
    ├── my-appointments.html     # Donor: my appointments
    ├── my-donations.html        # Donor: my donation history
    ├── my-notifications.html    # Donor: personal notifications
    ├── my-requests.html         # Donor: blood requests
    ├── profile.html             # Donor: profile management
    └── 404.html                 # Error page
```

---

## 🚀 How to Use

### 1. Start the Backend
```bash
cd blood-donation-backend
npm run start:dev
# API runs at: http://localhost:3000/api
```

### 2. Open the Frontend
Simply open `Frontend/index.html` in a browser.
> **Tip:** Use VS Code Live Server or any static file server for best experience.

```bash
# Using Python (quick option)
cd Frontend
python -m http.server 5500
# Then visit: http://localhost:5500
```

---

## 🔐 Login Roles

### Admin
- Login at: `pages/login.html` → Admin tab
- System identifies Admin by role stored in the database
- Has **full access** to all pages

### Hospital Incharge
- Login at: `pages/login.html` → Hospital tab
- Created by Admin only (via Users page)
- Has access to: Dashboard, Inventory, Blood Requests, Camps

### Donor
- Login/Register at: `pages/login.html` → Donor tab
- Self-registration available
- Has access to: Dashboard, My Appointments, My Donations, Notifications, Eligibility, Profile

---

## 🎨 Design System

| Color       | Value     | Usage              |
|-------------|-----------|---------------------|
| Red         | `#C8102E` | Primary / blood     |
| Red Dark    | `#9B0B22` | Hover states        |
| White       | `#FFFFFF` | Backgrounds         |
| Gray 50     | `#F8F8F8` | Page backgrounds    |

Fonts: **Playfair Display** (headings) + **DM Sans** (body)

---

## 🔗 API Endpoints Covered

All routes from the backend are wired in `js/api.js`:

| Module         | Routes |
|----------------|--------|
| Auth           | register, login, logout, me |
| Users          | findAll, findOne, update, updateRole, remove |
| Donors         | create, findAll, search, findOne, update, remove, hardDelete |
| Donations      | create, findAll, findOne, findByDonor, getStats, cancel |
| Appointments   | create, findAll, findUpcoming, findByDonor, findOne, update, updateStatus |
| Inventory      | findAll, getLowStock, checkAvailability, findOne, addStock, issueStock, markExpired, update |
| Blood Requests | create, findAll, findOne, updateStatus, cancel |
| Hospitals      | create, findAll, findOne, update, remove |
| Camps          | create, findAll, findUpcoming, findOne, update, remove |
| Eligibility    | check, findAllByDonor, findLatestByDonor |
| Notifications  | create, findAllByDonor, findUnreadByDonor, markAsRead, markAllAsRead, remove |
| Dashboard      | getStats |

---

## 📝 Notes

- **CORS** is enabled on the backend (`origin: '*'`) — works out of the box
- **JWT tokens** are stored in `localStorage` as `lp_token`
- **User data** is stored in `localStorage` as `lp_user`
- The `quantityUnits` field from the inventory entity is normalized to `units` in the frontend
- The dashboard stats use the nested response shape: `{ donors: { total, active }, inventory: { totalUnits, byBloodGroup, lowStockAlerts }, ... }`

---

*Built with ❤️ for LifePulse Blood Donation Management System*
