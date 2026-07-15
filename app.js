// State Management
let businesses = JSON.parse(localStorage.getItem('multiflow_businesses')) || [];
let transactions = JSON.parse(localStorage.getItem('multiflow_transactions')) || [];
let currentView = 'all'; // 'all' or business ID

// DOM Elements
const businessListEl = document.getElementById('business-list');
const transactionsListEl = document.getElementById('transactions-list');
const txBusinessSelect = document.getElementById('tx-business');
const currentViewTitle = document.getElementById('current-view-title');

const statIncome = document.getElementById('stat-income');
const statExpense = document.getElementById('stat-expense');
const statBalance = document.getElementById('stat-balance');

// Modals
const txModal = document.getElementById('transaction-modal');
const bizModal = document.getElementById('business-modal');

// Init
function init() {
    if (businesses.length === 0) {
        // Create a default business if none exist
        addBusiness('Mi Primer Emprendimiento');
    }
    renderBusinesses();
    renderTransactions();
    updateStats();
}

// Persist Data
function saveData() {
    localStorage.setItem('multiflow_businesses', JSON.stringify(businesses));
    localStorage.setItem('multiflow_transactions', JSON.stringify(transactions));
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Business Logic
function addBusiness(name) {
    const newBiz = { id: generateId(), name: name };
    businesses.push(newBiz);
    saveData();
    renderBusinesses();
}

// Transaction Logic
function addTransaction(type, amount, desc, businessId) {
    const tx = {
        id: generateId(),
        type, // 'income' or 'expense'
        amount: parseFloat(amount),
        desc,
        businessId,
        date: new Date().toISOString()
    };
    transactions.push(tx);
    saveData();
    renderTransactions();
    updateStats();
}

// Rendering
function renderBusinesses() {
    // Keep the "Vista General" item
    const allItem = `
        <li class="${currentView === 'all' ? 'active' : ''}" data-id="all" onclick="changeView('all')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Vista General
        </li>
    `;
    
    let bizItems = businesses.map(b => `
        <li class="${currentView === b.id ? 'active' : ''}" data-id="${b.id}" onclick="changeView('${b.id}')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            ${b.name}
        </li>
    `).join('');

    businessListEl.innerHTML = allItem + bizItems;

    // Update select options for modal
    txBusinessSelect.innerHTML = businesses.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
}

function renderTransactions() {
    let filteredTxs = transactions;
    if (currentView !== 'all') {
        filteredTxs = transactions.filter(tx => tx.businessId === currentView);
    }

    // Sort by date descending
    filteredTxs.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredTxs.length === 0) {
        transactionsListEl.innerHTML = '<div class="empty-state">No hay movimientos registrados.</div>';
        return;
    }

    transactionsListEl.innerHTML = filteredTxs.map(tx => {
        const isIncome = tx.type === 'income';
        const sign = isIncome ? '+' : '-';
        const amountClass = isIncome ? 'text-success' : 'text-danger';
        const bizName = businesses.find(b => b.id === tx.businessId)?.name || 'Desconocido';
        const dateStr = new Date(tx.date).toLocaleDateString();

        return `
            <div class="transaction-item">
                <div class="tx-info">
                    <h4>${tx.desc}</h4>
                    <div class="tx-meta">
                        <span>${dateStr}</span>
                        ${currentView === 'all' ? `<span class="badge">${bizName}</span>` : ''}
                    </div>
                </div>
                <div class="tx-amount ${amountClass}">
                    ${sign} ${formatCurrency(tx.amount)}
                </div>
            </div>
        `;
    }).join('');
}

function updateStats() {
    let income = 0;
    let expense = 0;

    let filteredTxs = transactions;
    if (currentView !== 'all') {
        filteredTxs = transactions.filter(tx => tx.businessId === currentView);
    }

    filteredTxs.forEach(tx => {
        if (tx.type === 'income') income += tx.amount;
        if (tx.type === 'expense') expense += tx.amount;
    });

    const balance = income - expense;

    statIncome.textContent = formatCurrency(income);
    statExpense.textContent = formatCurrency(expense);
    statBalance.textContent = formatCurrency(balance);
}

function changeView(id) {
    currentView = id;
    if (id === 'all') {
        currentViewTitle.textContent = 'Vista General';
    } else {
        const b = businesses.find(b => b.id === id);
        if (b) currentViewTitle.textContent = b.name;
    }
    renderBusinesses();
    renderTransactions();
    updateStats();
}

// Event Listeners (Modals)
document.getElementById('new-transaction-btn').addEventListener('click', () => {
    if(businesses.length === 0) {
        alert("Primero debes crear un negocio.");
        return;
    }
    txModal.classList.remove('hidden');
});
document.getElementById('close-tx-modal').addEventListener('click', () => txModal.classList.add('hidden'));

document.getElementById('add-business-btn').addEventListener('click', () => bizModal.classList.remove('hidden'));
document.getElementById('close-biz-modal').addEventListener('click', () => bizModal.classList.add('hidden'));

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === txModal) txModal.classList.add('hidden');
    if (e.target === bizModal) bizModal.classList.add('hidden');
});

// Form Submissions
document.getElementById('transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.querySelector('input[name="type"]:checked').value;
    const amount = document.getElementById('tx-amount').value;
    const desc = document.getElementById('tx-desc').value;
    const bizId = document.getElementById('tx-business').value;

    addTransaction(type, amount, desc, bizId);
    
    // Reset and close
    e.target.reset();
    document.getElementById('type-income').checked = true; // reset toggle
    txModal.classList.add('hidden');
});

document.getElementById('business-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('biz-name').value;
    addBusiness(name);
    
    // Reset and close
    e.target.reset();
    bizModal.classList.add('hidden');
});

// Startup
init();
