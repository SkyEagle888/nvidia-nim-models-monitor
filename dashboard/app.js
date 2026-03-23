// NVIDIA Model Explorer - Dashboard Logic

// Data storage
let modelsData = [];
let changelogData = { changes: [] };
let providerFilter = null;
let dataTable = null;

// Model type classification
const MODEL_TYPE_PATTERNS = {
    'instruct': ['instruct', 'chat', 'rlhf'],
    'vision': ['vision', 'vlm', 'v1', 'neva', 'vila', 'deplot', 'kosmos', 'fuyu', 'pali', 'shieldgemma'],
    'embed': ['embed', 'retriever', 'nvclip', 'bge', 'arctic-embed'],
    'code': ['code', 'starcoder', 'codestral', 'codegemma'],
    'guard': ['guard', 'safety', 'content-safety', 'topic-control'],
    'reward': ['reward'],
    'base': ['base', 'foundation']
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initializeCharts();
    initializeTable();
    renderStats();
    renderProviderFilters();
    renderChangeHistory();
    renderTopProviders();
    setupSearchFilter();
});

// Load models and changelog data
async function loadData() {
    try {
        console.log('Loading models data...');
        // Load models
        const modelsResponse = await fetch('../models.json');
        if (!modelsResponse.ok) {
            throw new Error(`Failed to load models.json: ${modelsResponse.status}`);
        }
        modelsData = await modelsResponse.json();
        console.log(`Loaded ${modelsData.length} models`);

        // Load changelog
        try {
            const changelogResponse = await fetch('../CHANGELOG.json');
            if (changelogResponse.ok) {
                changelogData = await changelogResponse.json();
                console.log(`Loaded ${changelogData.changes.length} changelog entries`);
            } else {
                console.log('No changelog found, using empty data');
                changelogData = { changes: [] };
            }
        } catch (e) {
            console.log('No changelog found, using empty data');
            changelogData = { changes: [] };
        }

        // Update last updated time from models.json
        updateLastUpdated();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading dashboard data. Please ensure models.json exists.');
    }
}

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) + ' UTC';
}

// Get provider from model ID
function getProvider(modelId) {
    return modelId.split('/')[0] || 'unknown';
}

// Get model type from model ID
function getModelType(modelId) {
    const modelLower = modelId.toLowerCase();
    
    for (const [type, patterns] of Object.entries(MODEL_TYPE_PATTERNS)) {
        if (patterns.some(pattern => modelLower.includes(pattern))) {
            return type;
        }
    }
    
    return 'other';
}

// Get models by provider
function getModelsByProvider() {
    const grouped = {};
    modelsData.forEach(model => {
        const provider = getProvider(model);
        if (!grouped[provider]) {
            grouped[provider] = [];
        }
        grouped[provider].push(model);
    });
    return grouped;
}

// Get models by type
function getModelsByType() {
    const grouped = {};
    modelsData.forEach(model => {
        const type = getModelType(model);
        if (!grouped[type]) {
            grouped[type] = [];
        }
        grouped[type].push(model);
    });
    return grouped;
}

// Render stats cards
function renderStats() {
    const providers = new Set(modelsData.map(m => getProvider(m)));
    const types = new Set(modelsData.map(m => getModelType(m)));
    const latestChange = changelogData.changes.length > 0 ? changelogData.changes[changelogData.changes.length - 1] : null;
    
    document.getElementById('totalModels').textContent = modelsData.length;
    document.getElementById('totalProviders').textContent = providers.size;
    document.getElementById('modelTypes').textContent = types.size;
    
    if (latestChange) {
        const changes = latestChange.added.length + latestChange.removed.length;
        document.getElementById('latestChanges').textContent = changes > 0 ? `+${latestChange.added.length}/-${latestChange.removed.length}` : 'No changes';
    } else {
        document.getElementById('latestChanges').textContent = 'N/A';
    }
}

// Initialize charts
let providerChart = null;
let categoryChart = null;

function initializeCharts() {
    const providerData = getModelsByProvider();
    const typeData = getModelsByType();
    
    // Sort providers by count and take top 15
    const sortedProviders = Object.entries(providerData)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 15);
    
    // Provider Distribution Chart (Bar)
    const providerCtx = document.getElementById('providerChart').getContext('2d');
    providerChart = new Chart(providerCtx, {
        type: 'bar',
        data: {
            labels: sortedProviders.map(([name]) => name),
            datasets: [{
                label: 'Models',
                data: sortedProviders.map(([, models]) => models.length),
                backgroundColor: 'rgba(22, 163, 74, 0.7)',
                borderColor: 'rgba(22, 163, 74, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} models`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
    
    // Category Chart (Pie)
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(typeData).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
            datasets: [{
                data: Object.values(typeData).map(models => models.length),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(236, 72, 153, 0.7)',
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(148, 163, 184, 0.7)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                    'rgba(99, 102, 241, 1)',
                    'rgba(148, 163, 184, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} models (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize DataTable
function initializeTable() {
    const tableData = modelsData.map(model => ({
        id: model,
        provider: getProvider(model),
        type: getModelType(model)
    }));
    
    dataTable = $('#modelsTable').DataTable({
        data: tableData,
        columns: [
            { 
                data: 'id',
                render: (data) => `<code class="text-sm bg-gray-100 px-2 py-1 rounded">${data}</code>`
            },
            { 
                data: 'provider',
                render: (data) => `<span class="provider-badge px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm">${data}</span>`
            },
            { 
                data: 'type',
                render: (data) => `<span class="badge badge-${data}">${data}</span>`
            },
            {
                data: null,
                render: (data) => `
                    <button class="copy-btn px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100" 
                            onclick="copyToClipboard('${data.id}', this)">
                        📋 Copy
                    </button>
                `
            }
        ],
        order: [[0, 'asc']],
        pageLength: 25,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'All']],
        dom: 'lrtip',
        language: {
            info: 'Showing _START_ to _END_ of _TOTAL_ models',
            infoEmpty: 'No models available',
            infoFiltered: '(filtered from _MAX_ total models)'
        }
    });
}

// Render provider filter buttons
function renderProviderFilters() {
    const providerData = getModelsByProvider();
    const sortedProviders = Object.entries(providerData)
        .sort((a, b) => b[1].length - a[1].length);
    
    const filterContainer = document.getElementById('providerFilters');
    
    // All button
    const allBtn = document.createElement('button');
    allBtn.className = 'provider-filter active px-4 py-2 text-sm border border-gray-300 rounded-full bg-green-500 text-white';
    allBtn.textContent = 'All Providers';
    allBtn.onclick = () => filterByProvider(null, allBtn);
    filterContainer.appendChild(allBtn);
    
    // Provider buttons
    sortedProviders.forEach(([provider, models]) => {
        const btn = document.createElement('button');
        btn.className = 'provider-filter px-4 py-2 text-sm border border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200';
        btn.textContent = `${provider} (${models.length})`;
        btn.onclick = () => filterByProvider(provider, btn);
        filterContainer.appendChild(btn);
    });
}

// Filter by provider
function filterByProvider(provider, btn) {
    providerFilter = provider;
    
    // Update button states
    document.querySelectorAll('.provider-filter').forEach(b => {
        b.classList.remove('active', 'bg-green-500', 'text-white');
        b.classList.add('bg-gray-100');
    });
    
    btn.classList.add('active', 'bg-green-500', 'text-white');
    btn.classList.remove('bg-gray-100');
    
    // Filter table
    if (provider) {
        dataTable.column(1).search(provider).draw();
    } else {
        dataTable.column(1).search('').draw();
    }
}

// Setup search filter
function setupSearchFilter() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        dataTable.search(e.target.value).draw();
    });
}

// Render change history
function renderChangeHistory() {
    const historyContainer = document.getElementById('changeHistory');
    
    if (changelogData.changes.length === 0) {
        historyContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No change history available yet.</p>';
        return;
    }
    
    const recentChanges = changelogData.changes.slice(-10).reverse();
    
    historyContainer.innerHTML = recentChanges.map(change => {
        const date = new Date(change.timestamp);
        const dateStr = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const hasChanges = change.added.length > 0 || change.removed.length > 0;
        
        return `
            <div class="change-item ${hasChanges ? (change.added.length > 0 ? 'added' : 'removed') : ''} py-3">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">${dateStr}</span>
                    <span class="text-xs text-gray-500">Total: ${change.total_models} models</span>
                </div>
                ${change.added.length > 0 ? `
                    <div class="mb-1">
                        <span class="text-xs font-medium text-green-600">✨ Added (${change.added.length}):</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${change.added.slice(0, 5).map(m => 
                                `<span class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">${m}</span>`
                            ).join('')}
                            ${change.added.length > 5 ? `<span class="text-xs text-gray-500">+${change.added.length - 5} more</span>` : ''}
                        </div>
                    </div>
                ` : ''}
                ${change.removed.length > 0 ? `
                    <div>
                        <span class="text-xs font-medium text-red-600">❌ Removed (${change.removed.length}):</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${change.removed.slice(0, 5).map(m => 
                                `<span class="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">${m}</span>`
                            ).join('')}
                            ${change.removed.length > 5 ? `<span class="text-xs text-gray-500">+${change.removed.length - 5} more</span>` : ''}
                        </div>
                    </div>
                ` : ''}
                ${!hasChanges ? '<p class="text-sm text-gray-500">✅ No changes detected</p>' : ''}
            </div>
        `;
    }).join('');
}

// Render top providers
function renderTopProviders() {
    const providerData = getModelsByProvider();
    const sortedProviders = Object.entries(providerData)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 9);
    
    const container = document.getElementById('topProviders');
    
    container.innerHTML = sortedProviders.map(([provider, models]) => `
        <div class="provider-card p-4 border border-gray-200 rounded-lg" onclick="filterByProvider('${provider}', event.target)">
            <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-800">${provider}</h3>
                <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">${models.length}</span>
            </div>
            <p class="text-sm text-gray-500 mt-1">${models.length} model${models.length !== 1 ? 's' : ''}</p>
            <div class="mt-2 flex flex-wrap gap-1">
                ${models.slice(0, 3).map(m => 
                    `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded truncate max-w-[120px]" title="${m}">${m.split('/').pop()}</span>`
                ).join('')}
                ${models.length > 3 ? `<span class="text-xs text-gray-400">+${models.length - 3} more</span>` : ''}
            </div>
        </div>
    `).join('');
}

// Copy to clipboard
function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✅ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = '📋 Copy';
            btn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        btn.textContent = '❌ Failed';
    });
}
