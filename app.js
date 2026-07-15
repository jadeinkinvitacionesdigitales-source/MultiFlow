let businesses = JSON.parse(localStorage.getItem('multiflow_businesses')) || [];
let transactions = JSON.parse(localStorage.getItem('multiflow_transactions')) || [];
let currentView = 'all';

const businessListEl = document.getElementById('business-list');
const transactionsListEl = document.getElementById('transactions-list');
const txBusinessSelect = document.getElementById('tx-business');
const currentViewTitle = document.getElementById('current-view-title');
const statIncome = document.getElementById('stat-income');
const statExpense = document.getElementById('stat-expense');
const statBalance = document.getElementById('stat-balance');
const txModal = document.getElementById('transaction-modal');
const bizModal = document.getElementById('business-modal');

// Hamburger Menu Logic
const hamburgerBtn = document.getElementById('hamburger-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

if(hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('show');
    });
}

if(sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
    });
}

function init() {
    if (businesses.length === 0) {
        addBusiness('Mi Primer Emprendimiento');
    }
    renderBusinesses();
    renderTransactions();
    updateStats();
}

function saveData() {
    localStorage.setItem('multiflow_businesses', JSON.stringify(businesses));
    localStorage.setItem('multiflow_transactions', JSON.stringify(transactions));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function generateId() { return Math.random().toString(36).substr(2, 9); }

function addBusiness(name) {
    businesses.push({ id: generateId(), name: name });
    saveData();
    renderBusinesses();
}

function addTransaction(type, amount, desc, businessId) {
    transactions.push({
        id: generateId(), type, amount: parseFloat(amount), desc, businessId, date: new Date().toISOString()
    });
    saveData();
    renderTransactions();
    updateStats();
}

function renderBusinesses() {
    const allItem = `
        <li class="${currentView === 'all' ? 'active' : ''}" data-id="all" onclick="changeView('all')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Vista General
        </li>`;
    let bizItems = businesses.map(b => `
        <li class="${currentView === b.id ? 'active' : ''}" data-id="${b.id}" onclick="changeView('${b.id}')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            ${b.name}
        </li>`).join('');
    businessListEl.innerHTML = allItem + bizItems;
    txBusinessSelect.innerHTML = businesses.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
}

function renderTransactions() {
    let filteredTxs = currentView !== 'all' ? transactions.filter(tx => tx.businessId === currentView) : transactions;
    filteredTxs.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredTxs.length === 0) {
        transactionsListEl.innerHTML = '<div class="empty-state">No hay movimientos registrados.</div>';
        return;
    }
    transactionsListEl.innerHTML = filteredTxs.map(tx => {
        const isIncome = tx.type === 'income';
        const bizName = businesses.find(b => b.id === tx.businessId)?.name || 'Desconocido';
        return `
            <div class="transaction-item">
                <div class="tx-info">
                    <h4>${tx.desc}</h4>
                    <div class="tx-meta">
                        <span>${new Date(tx.date).toLocaleDateString()}</span>
                        ${currentView === 'all' ? `<span class="badge">${bizName}</span>` : ''}
                    </div>
                </div>
                <div class="tx-amount ${isIncome ? 'text-success' : 'text-danger'}">
                    ${isIncome ? '+' : '-'} ${formatCurrency(tx.amount)}
                </div>
            </div>`;
    }).join('');
}

function updateStats() {
    let income = 0; let expense = 0;
    let filteredTxs = currentView !== 'all' ? transactions.filter(tx => tx.businessId === currentView) : transactions;
    
    filteredTxs.forEach(tx => {
        if (tx.type === 'income') income += tx.amount;
        if (tx.type === 'expense') expense += tx.amount;
    });
    
    statIncome.textContent = formatCurrency(income);
    statExpense.textContent = formatCurrency(expense);
    statBalance.textContent = formatCurrency(income - expense);
}

// Ensure changeView is globally accessible
window.changeView = function(id) {
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
    
    // Close sidebar automatically on mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
    }
}

document.getElementById('new-transaction-btn').addEventListener('click', () => {
    if(businesses.length === 0) { alert("Primero debes crear un negocio."); return; }
    txModal.classList.remove('hidden');
});
document.getElementById('close-tx-modal').addEventListener('click', () => txModal.classList.add('hidden'));

document.getElementById('add-business-btn').addEventListener('click', () => {
    // Also close sidebar on mobile if opening the modal
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
    }
    bizModal.classList.remove('hidden');
});
document.getElementById('close-biz-modal').addEventListener('click', () => bizModal.classList.add('hidden'));

window.addEventListener('click', (e) => {
    if (e.target === txModal) txModal.classList.add('hidden');
    if (e.target === bizModal) bizModal.classList.add('hidden');
});

document.getElementById('transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addTransaction(
        document.querySelector('input[name="type"]:checked').value,
        document.getElementById('tx-amount').value,
        document.getElementById('tx-desc').value,
        document.getElementById('tx-business').value
    );
    e.target.reset(); document.getElementById('type-income').checked = true;
    txModal.classList.add('hidden');
});

document.getElementById('business-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addBusiness(document.getElementById('biz-name').value);
    e.target.reset();
    bizModal.classList.add('hidden');
});

init();
