<div align="center">

# 📦 StockSense — Inventory Management System

**A modern, real-time inventory tracker built with React + Vite**

![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-v6-ca4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf?style=for-the-badge)

</div>

---

## 🌐 Live Development Server

> Run locally and open in your browser:

```
http://localhost:5173
```

> To start the dev server:

```bash
npm install
npm run dev
```

Then navigate to **http://localhost:5173** in your browser.

---

## 🖥️ Preview

| Dashboard | Inventory | Alerts |
|---|---|---|
| Live KPI cards + Charts | Full product table | Low & out-of-stock items |

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Live KPI cards, animated Donut chart (by category), Bar chart (stock levels), activity feed |
| 📦 **Inventory** | Full product table with search, filter, sort, inline stock update, edit & delete |
| ➕ **Add / Edit** | Rich form with validation — name, SKU, category, pricing, location, thresholds |
| 🔔 **Alerts** | Auto-detects low-stock & out-of-stock products with one-click restock |
| 📈 **Reports** | Total value, category breakdown, top products, CSV export |
| 🏷️ **Categories** | Add/delete custom categories with color picker & emoji |
| 🔄 **Real-time State** | Every action instantly reflects across all pages (no page reload) |
| 💾 **Persistence** | All data saved to `localStorage` — survives browser refresh |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/YashG1195/Inventory-tracker.git

# 2. Navigate into the project
cd Inventory-tracker

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

Open your browser at:

```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## 🗂️ Project Structure

```
inventory_tracker/
├── index.html                          ← Vite HTML entry
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                        ← React entry point
    ├── App.jsx                         ← Router + Layout shell
    ├── index.css                       ← Dark theme design system
    ├── context/
    │   └── InventoryContext.jsx        ← Global state (useReducer + localStorage)
    ├── data/
    │   └── defaults.js                 ← Demo products & default categories
    ├── utils/
    │   └── helpers.js                  ← Shared utility functions
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.jsx             ← Collapsible sidebar with NavLink
    │   │   └── Topbar.jsx              ← Live clock, search, notifications
    │   ├── ui/
    │   │   ├── Modal.jsx               ← Reusable modal (Escape key support)
    │   │   ├── Toast.jsx               ← Auto-dismiss toast notifications
    │   │   └── StatusBadge.jsx         ← In Stock / Low Stock / Out of Stock
    │   └── charts/
    │       ├── DonutChart.jsx          ← Recharts PieChart (category distribution)
    │       └── StockBarChart.jsx       ← Recharts BarChart (stock levels)
    └── pages/
        ├── Dashboard.jsx
        ├── Inventory.jsx
        ├── AddProduct.jsx              ← Handles both /add and /edit/:id
        ├── Alerts.jsx
        ├── Reports.jsx
        └── Categories.jsx
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI component framework |
| **Vite** | Lightning-fast build tool & dev server |
| **react-router-dom v6** | Client-side URL routing |
| **Recharts** | Interactive animated charts |
| **React Context + useReducer** | Global state management |
| **localStorage** | Browser-side data persistence |
| **Vanilla CSS** | Custom dark theme design system |

---

## 📋 How to Use

1. **Dashboard** — View live stats, charts, and recent activity
2. **Inventory** → **Add Product** — Fill the form to add new stock items
3. **Inventory** → 🔄 button — Update stock quantity (Set / Add / Remove)
4. **Inventory** → ✏️ button — Edit product details
5. **Alerts** — See all low/out-of-stock items and restock instantly
6. **Reports** → **Export CSV** — Download full inventory as a spreadsheet
7. **Categories** — Add custom categories with color and emoji

---

## 👤 Author

**Yash** — [YashG1195](https://github.com/YashG1195)

---

<div align="center">
  <sub>Built with ❤️ using React + Vite</sub>
</div>
