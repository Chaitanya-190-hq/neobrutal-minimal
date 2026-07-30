/* ============================================================
   CHAI ARCHIVE LOGBOOK — Application Logic
   All data stored locally in browser localStorage
   ============================================================ */

// ============================================================
// CONSTANTS
// ============================================================
const STORAGE_KEY_ARCHIVES = 'chai_archive_archives';
const STORAGE_KEY_VAULT = 'chai_archive_vault';
const STORAGE_KEY_COUNTER = 'chai_archive_counter';
const STORAGE_KEY_VAULT_COUNTER = 'chai_archive_vault_counter';
const STORAGE_KEY_DARK_MODE = 'chai_archive_dark_mode';
const STORAGE_KEY_PRINT_MODE = 'chai_archive_print_mode';

const CATEGORIES = [
  'Learning', 'Python', 'Programming', 'Certificates',
  'Personal', 'Milestones', 'Projects', 'Discord',
  'Chai Archive', 'Future Vault', 'Other'
];

const MOODS = [
  { value: 'triumphant', emoji: '🏆', label: 'Triumphant' },
  { value: 'grateful', emoji: '🙏', label: 'Grateful' },
  { value: 'excited', emoji: '🎉', label: 'Excited' },
  { value: 'reflective', emoji: '🤔', label: 'Reflective' },
  { value: 'proud', emoji: '💪', label: 'Proud' },
  { value: 'nostalgic', emoji: '🌅', label: 'Nostalgic' },
  { value: 'determined', emoji: '🔥', label: 'Determined' },
  { value: 'peaceful', emoji: '☮️', label: 'Peaceful' },
  { value: 'inspired', emoji: '💡', label: 'Inspired' },
  { value: 'accomplished', emoji: '✨', label: 'Accomplished' }
];

// ============================================================
// STATE
// ============================================================
let state = {
  archives: [],
  vaultEntries: [],
  currentArchiveId: null,
  editingArchiveId: null,
  currentVaultId: null,
  currentPage: 'dashboard',
  searchQuery: '',
  filterCategory: 'all',
  filterImportance: 'all',
  filterSort: 'newest',
  vaultSearch: '',
  timelineYear: 'all',
  timelineCategory: 'all',
  isDarkMode: false,
  isPrintMode: false
};

// ============================================================
// DATA LAYER
// ============================================================
function loadData() {
  try {
    const archivesRaw = localStorage.getItem(STORAGE_KEY_ARCHIVES);
    state.archives = archivesRaw ? JSON.parse(archivesRaw) : [];

    const vaultRaw = localStorage.getItem(STORAGE_KEY_VAULT);
    state.vaultEntries = vaultRaw ? JSON.parse(vaultRaw) : [];

    state.isDarkMode = localStorage.getItem(STORAGE_KEY_DARK_MODE) === 'true';
    state.isPrintMode = localStorage.getItem(STORAGE_KEY_PRINT_MODE) === 'true';
  } catch (e) {
    console.error('Error loading data:', e);
    state.archives = [];
    state.vaultEntries = [];
  }
}

function saveArchives() {
  localStorage.setItem(STORAGE_KEY_ARCHIVES, JSON.stringify(state.archives));
}

function saveVault() {
  localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(state.vaultEntries));
}

function getNextArchiveId() {
  let counter = parseInt(localStorage.getItem(STORAGE_KEY_COUNTER) || '0', 10);
  counter++;
  localStorage.setItem(STORAGE_KEY_COUNTER, counter.toString());
  return `CA-${String(counter).padStart(4, '0')}`;
}

function getNextVaultId() {
  let counter = parseInt(localStorage.getItem(STORAGE_KEY_VAULT_COUNTER) || '0', 10);
  counter++;
  localStorage.setItem(STORAGE_KEY_VAULT_COUNTER, counter.toString());
  return `FV-${String(counter).padStart(4, '0')}`;
}

function getArchivesCount() {
  return state.archives.length;
}

function getVaultCount() {
  return state.vaultEntries.length;
}

function getCategoriesUsed() {
  const cats = new Set(state.archives.map(a => a.category));
  return cats.size;
}

function getTopImportance() {
  if (state.archives.length === 0) return 0;
  return Math.max(...state.archives.map(a => a.importance || 1));
}

// ============================================================
// ARCHIVE CRUD
// ============================================================
function createArchive(data) {
  const archive = {
    id: getNextArchiveId(),
    title: data.title,
    category: data.category,
    description: data.description,
    date: data.date,
    tags: data.tags || [],
    importance: data.importance || 3,
    mood: data.mood || '',
    fileNames: data.fileNames || [],
    notes: data.notes || '',
    futureMessage: data.futureMessage || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  state.archives.unshift(archive);
  saveArchives();
  return archive;
}

function updateArchive(id, data) {
  const index = state.archives.findIndex(a => a.id === id);
  if (index === -1) return null;
  state.archives[index] = {
    ...state.archives[index],
    ...data,
    id: state.archives[index].id,
    createdAt: state.archives[index].createdAt,
    updatedAt: new Date().toISOString()
  };
  saveArchives();
  return state.archives[index];
}

function deleteArchive(id) {
  state.archives = state.archives.filter(a => a.id !== id);
  saveArchives();
}

function getArchive(id) {
  return state.archives.find(a => a.id === id);
}

// ============================================================
// VAULT CRUD
// ============================================================
function createVaultEntry(data) {
  const entry = {
    id: getNextVaultId(),
    title: data.title,
    serialNumber: data.serialNumber || '',
    accountRef: data.accountRef || '',
    preservationId: data.preservationId || '',
    reminder: data.reminder || '',
    reference: data.reference || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  state.vaultEntries.unshift(entry);
  saveVault();
  return entry;
}

function updateVaultEntry(id, data) {
  const index = state.vaultEntries.findIndex(e => e.id === id);
  if (index === -1) return null;
  state.vaultEntries[index] = {
    ...state.vaultEntries[index],
    ...data,
    id: state.vaultEntries[index].id,
    createdAt: state.vaultEntries[index].createdAt,
    updatedAt: new Date().toISOString()
  };
  saveVault();
  return state.vaultEntries[index];
}

function deleteVaultEntry(id) {
  state.vaultEntries = state.vaultEntries.filter(e => e.id !== id);
  saveVault();
}

function getVaultEntry(id) {
  return state.vaultEntries.find(e => e.id === id);
}

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page, params = {}) {
  state.currentPage = page;

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Toggle pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const targetPage = document.getElementById(`page-${page}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Handle specific page setup
  switch (page) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'archives':
      renderArchivesList();
      break;
    case 'archive-form':
      setupForm(params.editId || null);
      break;
    case 'archive-detail':
      if (params.id) {
        state.currentArchiveId = params.id;
        renderArchiveDetail(params.id);
      }
      break;
    case 'future-vault':
      renderVaultList();
      break;
    case 'timeline':
      renderTimeline();
      break;
    case 'settings':
      renderSettings();
      break;
  }

  updateSidebarStats();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
  const total = getArchivesCount();
  const vault = getVaultCount();
  const categories = getCategoriesUsed();
  const topImp = getTopImportance();

  document.querySelector('#stat-total .stat-value').textContent = total;
  document.querySelector('#stat-vault .stat-value').textContent = vault;
  document.querySelector('#stat-categories .stat-value').textContent = categories;
  document.querySelector('#stat-importance .stat-value').textContent = topImp > 0 ? '★'.repeat(topImp) : '★';

  renderCategoryBars();
  renderRecentArchives();
  renderImportanceBars();
}

function renderCategoryBars() {
  const container = document.getElementById('category-bars');
  if (state.archives.length === 0) {
    container.innerHTML = '<div class="empty-state">No archives yet. Create your first archive to see distribution.</div>';
    return;
  }

  const counts = {};
  state.archives.forEach(a => {
    counts[a.category] = (counts[a.category] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(counts));
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  container.innerHTML = sorted.map(([cat, count]) => `
    <div class="category-bar-row">
      <span class="category-bar-label">${cat}</span>
      <div class="category-bar-track">
        <div class="category-bar-fill" style="width: ${(count / maxCount) * 100}%"></div>
      </div>
      <span class="category-bar-count">${count}</span>
    </div>
  `).join('');
}

function renderRecentArchives() {
  const container = document.getElementById('recent-list');
  const recent = state.archives.slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = '<div class="empty-state">No recent archives.</div>';
    return;
  }

  container.innerHTML = recent.map(a => `
    <div class="recent-item" onclick="navigateTo('archive-detail', { id: '${a.id}' })">
      <span class="recent-item-id">${a.id}</span>
      <span class="recent-item-title">${escHtml(a.title)}</span>
      <span class="recent-item-category">${escHtml(a.category)}</span>
    </div>
  `).join('');
}

function renderImportanceBars() {
  const container = document.getElementById('importance-bars');
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  state.archives.forEach(a => {
    const imp = a.importance || 3;
    counts[imp] = (counts[imp] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(counts), 1);

  container.innerHTML = [5, 4, 3, 2, 1].map(imp => `
    <div class="importance-bar-row">
      <span class="importance-bar-label">${'★'.repeat(imp)}</span>
      <div class="importance-bar-track">
        <div class="importance-bar-fill" style="width: ${(counts[imp] / maxCount) * 100}%"></div>
      </div>
      <span class="importance-bar-count">${counts[imp]}</span>
    </div>
  `).join('');
}

// ============================================================
// ARCHIVES LIST
// ============================================================
function renderArchivesList() {
  const container = document.getElementById('archives-grid');
  let filtered = [...state.archives];

  // Search
  const query = state.searchQuery.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query) ||
      a.id.toLowerCase().includes(query) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(query))) ||
      a.description.toLowerCase().includes(query)
    );
  }

  // Filter category
  if (state.filterCategory !== 'all') {
    filtered = filtered.filter(a => a.category === state.filterCategory);
  }

  // Filter importance
  if (state.filterImportance !== 'all') {
    filtered = filtered.filter(a => (a.importance || 3) === parseInt(state.filterImportance));
  }

  // Sort
  switch (state.filterSort) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
      break;
    case 'title':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'importance':
      filtered.sort((a, b) => (b.importance || 1) - (a.importance || 1));
      break;
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;">No archives found. Create your first archive to begin preserving.</div>';
    return;
  }

  container.innerHTML = filtered.map(a => renderArchiveCard(a)).join('');
}

function renderArchiveCard(archive) {
  const stars = '★'.repeat(archive.importance || 3) + '☆'.repeat(5 - (archive.importance || 3));
  const moodEmoji = archive.mood ? MOODS.find(m => m.value === archive.mood)?.emoji || '' : '';
  const tags = (archive.tags || []).slice(0, 3);

  return `
    <div class="archive-card" onclick="navigateTo('archive-detail', { id: '${archive.id}' })">
      <div class="archive-card-stamp">
        <div class="archive-card-stamp-inner">CHAI<br/>ARCHIVE</div>
      </div>
      <div class="archive-card-header">
        <span class="archive-card-id">${archive.id}</span>
        <span class="archive-card-category">${escHtml(archive.category)}</span>
      </div>
      <div class="archive-card-body">
        <div class="archive-card-title">${escHtml(archive.title)}</div>
        <div class="archive-card-desc">${escHtml(archive.description)}</div>
        ${moodEmoji ? `<div class="archive-card-mood">${moodEmoji}</div>` : ''}
      </div>
      <div class="archive-card-footer">
        <span class="archive-card-date">📅 ${formatDate(archive.date || archive.createdAt)}</span>
        <div class="archive-card-tags">
          ${tags.map(t => `<span class="archive-card-tag">${escHtml(t)}</span>`).join('')}
          ${(archive.tags || []).length > 3 ? `<span class="archive-card-tag">+${archive.tags.length - 3}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderArchiveCardDetail(archive) {
  const stars = '★'.repeat(archive.importance || 3) + '☆'.repeat(5 - (archive.importance || 3));
  const moodEmoji = archive.mood ? MOODS.find(m => m.value === archive.mood) : null;
  const tags = archive.tags || [];

  return `
    <div class="archive-card-detail-wrapper" id="export-card">
      <div class="archive-card-stamp">
        <div class="archive-card-stamp-inner">CHAI<br/>ARCHIVE</div>
      </div>
      <div class="archive-card-header">
        <span class="archive-card-id">${archive.id}</span>
        <span class="archive-card-category">${escHtml(archive.category)}</span>
      </div>
      <div class="archive-card-body">
        <div class="archive-card-title">${escHtml(archive.title)}</div>
        <div class="archive-card-desc">${escHtml(archive.description)}</div>
      </div>
      <div class="detail-full-content">
        <div class="detail-field">
          <span class="detail-field-label">Date</span>
          <span class="detail-field-value">${formatDate(archive.date || archive.createdAt)}</span>
        </div>
        <div class="detail-field">
          <span class="detail-field-label">Importance</span>
          <span class="detail-field-value archive-card-importance">${stars}</span>
        </div>
        ${moodEmoji ? `
        <div class="detail-field">
          <span class="detail-field-label">Mood</span>
          <span class="detail-field-value">${moodEmoji.emoji} ${moodEmoji.label}</span>
        </div>` : ''}
        ${tags.length > 0 ? `
        <div class="detail-field">
          <span class="detail-field-label">Tags</span>
          <span class="detail-field-value">${tags.map(t => `<span class="archive-card-tag">${escHtml(t)}</span>`).join(' ')}</span>
        </div>` : ''}
        ${archive.notes ? `
        <div class="detail-field detail-field-full">
          <span class="detail-field-label">Personal Notes</span>
          <span class="detail-field-value">${escHtml(archive.notes)}</span>
        </div>` : ''}
        ${archive.futureMessage ? `
        <div class="detail-field detail-field-full">
          <span class="detail-field-label">✉ Future Message</span>
          <span class="detail-field-value" style="font-style: italic; color: var(--gold-dark);">${escHtml(archive.futureMessage)}</span>
        </div>` : ''}
      </div>
      <div class="archive-card-footer" style="flex-direction: column; align-items: flex-start; gap: 4px;">
        <div class="archive-card-tags">
          <span class="archive-card-tag">Created: ${formatDate(archive.createdAt)}</span>
          ${archive.updatedAt !== archive.createdAt ? `<span class="archive-card-tag">Updated: ${formatDate(archive.updatedAt)}</span>` : ''}
        </div>
      </div>
      <div class="archive-branding">
        <span class="archive-branding-left">📜 Chai Archive Logbook</span>
        <span>${archive.id} · PRESERVED</span>
      </div>
    </div>
  `;
}

// ============================================================
// ARCHIVE DETAIL
// ============================================================
function renderArchiveDetail(id) {
  const archive = getArchive(id);
  const container = document.getElementById('archive-card-wrapper');

  if (!archive) {
    container.innerHTML = '<div class="empty-state">Archive not found.</div>';
    return;
  }

  container.innerHTML = renderArchiveCardDetail(archive);

  // Set up QR modal on page
  const existingQr = document.querySelector('#qr-modal .qr-label');
  if (existingQr) {
    existingQr.textContent = archive.id;
  }
}

// ============================================================
// FORM
// ============================================================
function setupForm(editId = null) {
  const form = document.getElementById('archive-form');
  form.reset();
  document.getElementById('archive-id').value = '';

  const titleEl = document.getElementById('form-title');
  const subtitleEl = document.getElementById('form-subtitle');
  const submitBtn = document.getElementById('form-submit');

  if (editId) {
    const archive = getArchive(editId);
    if (!archive) {
      navigateTo('archives');
      return;
    }
    state.editingArchiveId = editId;
    titleEl.textContent = 'Edit Archive Entry';
    subtitleEl.textContent = `Editing ${archive.id}`;
    submitBtn.innerHTML = '<span class="btn-icon">📜</span> Update Archive';

    // Fill fields
    document.getElementById('archive-id').value = editId;
    document.getElementById('field-title').value = archive.title;
    document.getElementById('field-category').value = archive.category;
    document.getElementById('field-date').value = archive.date || '';
    document.getElementById('field-description').value = archive.description;
    document.getElementById('field-tags').value = (archive.tags || []).join(', ');
    document.getElementById('field-mood').value = archive.mood || '';
    document.getElementById('field-notes').value = archive.notes || '';
    document.getElementById('field-future').value = archive.futureMessage || '';

    // Set importance stars
    const importance = archive.importance || 3;
    document.getElementById('field-importance').value = importance;
    document.querySelectorAll('.star').forEach(star => {
      star.classList.toggle('active', parseInt(star.dataset.value) <= importance);
      star.textContent = parseInt(star.dataset.value) <= importance ? '★' : '☆';
    });
  } else {
    state.editingArchiveId = null;
    titleEl.textContent = 'New Archive Entry';
    subtitleEl.textContent = 'Preserve a memory, achievement, or milestone';
    submitBtn.innerHTML = '<span class="btn-icon">📜</span> Preserve Archive';

    // Set default date
    document.getElementById('field-date').value = new Date().toISOString().split('T')[0];

    // Reset stars
    document.getElementById('field-importance').value = 3;
    document.querySelectorAll('.star').forEach(star => {
      const val = parseInt(star.dataset.value);
      star.classList.toggle('active', val <= 3);
      star.textContent = val <= 3 ? '★' : '☆';
    });
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('field-title').value.trim();
  const category = document.getElementById('field-category').value;
  const date = document.getElementById('field-date').value;
  const description = document.getElementById('field-description').value.trim();
  const tagsRaw = document.getElementById('field-tags').value;
  const mood = document.getElementById('field-mood').value;
  const notes = document.getElementById('field-notes').value.trim();
  const futureMessage = document.getElementById('field-future').value.trim();
  const importance = parseInt(document.getElementById('field-importance').value) || 3;
  const filesInput = document.getElementById('field-files');
  const fileNames = filesInput.files ? Array.from(filesInput.files).map(f => f.name) : [];

  // Validation
  if (!title || !category || !date || !description) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

  const data = {
    title, category, date, description, tags, mood, notes, futureMessage,
    importance, fileNames
  };

  const editId = document.getElementById('archive-id').value;
  if (editId) {
    updateArchive(editId, data);
    showToast(`Archive ${editId} updated successfully.`, 'success');
    navigateTo('archive-detail', { id: editId });
  } else {
    const archive = createArchive(data);
    showToast(`Archive ${archive.id} preserved successfully.`, 'success');
    navigateTo('archive-detail', { id: archive.id });
  }
}

// ============================================================
// FUTURE VAULT
// ============================================================
function renderVaultList() {
  const container = document.getElementById('vault-list');
  const query = state.vaultSearch.toLowerCase().trim();

  let entries = [...state.vaultEntries];
  if (query) {
    entries = entries.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.id.toLowerCase().includes(query) ||
      (e.serialNumber || '').toLowerCase().includes(query) ||
      (e.accountRef || '').toLowerCase().includes(query)
    );
  }

  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-state">No vault entries yet. Create your first entry to secure important references.</div>';
    return;
  }

  container.innerHTML = entries.map(e => `
    <div class="vault-item" onclick="showVaultDetail('${e.id}')">
      <div class="vault-item-id">${e.id}</div>
      <div class="vault-item-title">${escHtml(e.title)}</div>
      <div class="vault-item-meta">
        ${e.serialNumber ? `<span>📋 ${escHtml(e.serialNumber)}</span>` : ''}
        ${e.accountRef ? `<span>🔑 ${escHtml(e.accountRef)}</span>` : ''}
        ${e.preservationId ? `<span>🏷 ${escHtml(e.preservationId)}</span>` : ''}
      </div>
      <div style="font-size: 11px; color: var(--text-muted);">
        Created: ${formatDate(e.createdAt)}
      </div>
      <div class="vault-item-actions">
        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); editVaultEntry('${e.id}')">✎ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteVaultEntryConfirm('${e.id}')">🗑</button>
      </div>
    </div>
  `).join('');
}

function showVaultDetail(id) {
  const entry = getVaultEntry(id);
  if (!entry) return;

  state.currentVaultId = id;
  document.getElementById('vault-detail-title').textContent = `${entry.id} — ${entry.title}`;
  document.getElementById('vault-detail-body').innerHTML = `
    <div class="settings-info-block" style="padding: 0;">
      <p><strong>Vault ID:</strong> ${entry.id}</p>
      <p><strong>Title:</strong> ${escHtml(entry.title)}</p>
      ${entry.serialNumber ? `<p><strong>Serial Number:</strong> ${escHtml(entry.serialNumber)}</p>` : ''}
      ${entry.accountRef ? `<p><strong>Account Reference:</strong> ${escHtml(entry.accountRef)}</p>` : ''}
      ${entry.preservationId ? `<p><strong>Preservation ID:</strong> ${escHtml(entry.preservationId)}</p>` : ''}
      ${entry.reminder ? `<p><strong>Future Reminder:</strong> ${formatDate(entry.reminder)}</p>` : ''}
      ${entry.reference ? `<p><strong>Reference:</strong> ${escHtml(entry.reference)}</p>` : ''}
      <p style="margin-top: 8px; font-size: 11px; color: var(--text-muted);">
        Created: ${formatDate(entry.createdAt)}
        ${entry.updatedAt !== entry.createdAt ? ` | Updated: ${formatDate(entry.updatedAt)}` : ''}
      </p>
    </div>
  `;

  document.getElementById('vault-detail-modal').classList.remove('hidden');
}

function openVaultForm(editId = null) {
  const modal = document.getElementById('vault-modal');
  const form = document.getElementById('vault-form');
  form.reset();

  if (editId) {
    const entry = getVaultEntry(editId);
    if (!entry) return;
    state.currentVaultId = editId;
    document.getElementById('vault-modal-title').textContent = 'Edit Vault Entry';
    document.getElementById('vault-id').value = editId;
    document.getElementById('vault-id-display').textContent = entry.id;
    document.getElementById('vault-title').value = entry.title;
    document.getElementById('vault-serial').value = entry.serialNumber || '';
    document.getElementById('vault-account').value = entry.accountRef || '';
    document.getElementById('vault-preservation').value = entry.preservationId || '';
    document.getElementById('vault-reminder').value = entry.reminder || '';
    document.getElementById('vault-reference').value = entry.reference || '';
  } else {
    state.currentVaultId = null;
    document.getElementById('vault-modal-title').textContent = 'New Vault Entry';
    document.getElementById('vault-id').value = '';
    document.getElementById('vault-id-display').textContent = getNextVaultId();
    // Don't actually increment counter until save
    // Reset display to next available
    let counter = parseInt(localStorage.getItem(STORAGE_KEY_VAULT_COUNTER) || '0', 10);
    document.getElementById('vault-id-display').textContent = `FV-${String(counter + 1).padStart(4, '0')}`;
  }

  modal.classList.remove('hidden');
}

function handleVaultFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('vault-title').value.trim();
  if (!title) {
    showToast('Please enter a title for the vault entry.', 'error');
    return;
  }

  const data = {
    title,
    serialNumber: document.getElementById('vault-serial').value.trim(),
    accountRef: document.getElementById('vault-account').value.trim(),
    preservationId: document.getElementById('vault-preservation').value.trim(),
    reminder: document.getElementById('vault-reminder').value,
    reference: document.getElementById('vault-reference').value.trim()
  };

  const editId = document.getElementById('vault-id').value;
  if (editId) {
    updateVaultEntry(editId, data);
    showToast(`Vault entry ${editId} updated.`, 'success');
  } else {
    const entry = createVaultEntry(data);
    showToast(`Vault entry ${entry.id} created.`, 'success');
  }

  document.getElementById('vault-modal').classList.add('hidden');
  document.getElementById('vault-detail-modal').classList.add('hidden');
  renderVaultList();
}

function deleteVaultEntryConfirm(id) {
  if (confirm(`Delete vault entry ${id}? This cannot be undone.`)) {
    deleteVaultEntry(id);
    document.getElementById('vault-detail-modal').classList.add('hidden');
    document.getElementById('vault-modal').classList.add('hidden');
    renderVaultList();
    showToast(`Vault entry ${id} deleted.`, 'info');
    updateSidebarStats();
  }
}

// ============================================================
// TIMELINE
// ============================================================
function renderTimeline() {
  const container = document.getElementById('timeline-container');

  // Populate year filter
  const yearSelect = document.getElementById('timeline-year');
  const years = new Set(state.archives.map(a => new Date(a.date || a.createdAt).getFullYear()));
  const currentYear = yearSelect.value;
  yearSelect.innerHTML = '<option value="all">All Years</option>' +
    Array.from(years).sort((a, b) => b - a).map(y => `<option value="${y}" ${y.toString() === currentYear ? 'selected' : ''}>${y}</option>`).join('');

  let entries = [...state.archives];
  if (state.timelineYear !== 'all') {
    entries = entries.filter(a => new Date(a.date || a.createdAt).getFullYear() === parseInt(state.timelineYear));
  }
  if (state.timelineCategory !== 'all') {
    entries = entries.filter(a => a.category === state.timelineCategory);
  }

  entries.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-state">No archives to display on the timeline.</div>';
    return;
  }

  container.innerHTML = entries.map((a, i) => `
    <div class="timeline-item" style="animation-delay: ${i * 0.05}s">
      <div class="timeline-item-content" onclick="navigateTo('archive-detail', { id: '${a.id}' })">
        <div class="timeline-item-header">
          <span class="timeline-item-title">${escHtml(a.title)}</span>
          <span class="timeline-item-date">${formatDate(a.date || a.createdAt)}</span>
        </div>
        <div class="timeline-item-meta">
          <span class="timeline-item-category">${escHtml(a.category)}</span>
          <span class="timeline-item-id">${a.id}</span>
          <span class="timeline-item-id">${'★'.repeat(a.importance || 3)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================================
// SETTINGS
// ============================================================
function renderSettings() {
  document.getElementById('settings-total').textContent = getArchivesCount();
  document.getElementById('settings-vault').textContent = getVaultCount();

  // Calculate storage used
  let totalSize = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    if (key.startsWith('chai_archive')) {
      totalSize += (key.length + value.length) * 2; // UTF-16
    }
  }
  const sizeKB = (totalSize / 1024).toFixed(1);
  document.getElementById('settings-storage').textContent = `${sizeKB} KB`;
}

function exportAllJSON() {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    archives: state.archives,
    vaultEntries: state.vaultEntries,
    counter: localStorage.getItem(STORAGE_KEY_COUNTER) || '0',
    vaultCounter: localStorage.getItem(STORAGE_KEY_VAULT_COUNTER) || '0'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chai-archive-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Archive backup exported successfully.', 'success');
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.archives || !Array.isArray(data.archives)) {
        showToast('Invalid backup file format.', 'error');
        return;
      }

      const count = data.archives.length;
      state.archives = data.archives;
      if (data.vaultEntries) {
        state.vaultEntries = data.vaultEntries;
      }
      if (data.counter) localStorage.setItem(STORAGE_KEY_COUNTER, data.counter);
      if (data.vaultCounter) localStorage.setItem(STORAGE_KEY_VAULT_COUNTER, data.vaultCounter);

      saveArchives();
      saveVault();
      showToast(`Imported ${count} archive(s) and ${(data.vaultEntries || []).length} vault entr(ies).`, 'success');
      navigateTo('dashboard');
    } catch (err) {
      showToast('Failed to import: Invalid JSON file.', 'error');
    }
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (confirm('⚠️ This will permanently delete ALL archives and vault entries. Are you sure?')) {
    if (confirm('This action CANNOT be undone. Proceed?')) {
      state.archives = [];
      state.vaultEntries = [];
      localStorage.removeItem(STORAGE_KEY_ARCHIVES);
      localStorage.removeItem(STORAGE_KEY_VAULT);
      localStorage.removeItem(STORAGE_KEY_COUNTER);
      localStorage.removeItem(STORAGE_KEY_VAULT_COUNTER);
      showToast('All data cleared.', 'info');
      navigateTo('dashboard');
    }
  }
}

// ============================================================
// EXPORTS
// ============================================================
async function exportPNG() {
  const card = document.querySelector('#export-card');
  if (!card) {
    showToast('No archive card to export.', 'error');
    return;
  }

  showToast('Generating PNG...', 'info');

  try {
    const archive = getArchive(state.currentArchiveId);
    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || '#fffdf9',
      logging: false,
      allowTaint: false
    });

    const link = document.createElement('a');
    link.download = `${archive ? archive.id : 'archive'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(`PNG saved: ${link.download}`, 'success');
  } catch (err) {
    console.error('PNG export error:', err);
    showToast('Failed to generate PNG. Please try again.', 'error');
  }
}

async function exportPDF() {
  const card = document.querySelector('#export-card');
  if (!card) {
    showToast('No archive card to export.', 'error');
    return;
  }

  showToast('Generating PDF...', 'info');

  try {
    const archive = getArchive(state.currentArchiveId);
    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || '#fffdf9',
      logging: false,
      allowTaint: false
    });

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('portrait', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const margin = 10;

    pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth - margin * 2, pdfHeight * ((pdfWidth - margin * 2) / canvas.width));
    pdf.save(`${archive ? archive.id : 'archive'}.pdf`);
    showToast(`PDF saved: ${archive ? archive.id : 'archive'}.pdf`, 'success');
  } catch (err) {
    console.error('PDF export error:', err);
    showToast('Failed to generate PDF. Please try again.', 'error');
  }
}

function showQR(id) {
  const archive = getArchive(id);
  if (!archive) return;

  document.getElementById('qr-modal').classList.remove('hidden');
  document.getElementById('qr-label').textContent = archive.id;

  const qrContainer = document.getElementById('qr-code');
  qrContainer.innerHTML = '';

  const qrData = JSON.stringify({
    id: archive.id,
    title: archive.title,
    category: archive.category,
    date: archive.date,
    preserved: archive.createdAt
  }, null, 2);

  if (typeof QRCode !== 'undefined') {
    new QRCode(qrContainer, {
      text: qrData,
      width: 180,
      height: 180,
      colorDark: '#2c1810',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    qrContainer.innerHTML = '<div style="padding:20px;color:var(--text-muted)">QR library not loaded.</div>';
  }
}

function downloadQR() {
  const canvas = document.querySelector('#qr-code canvas');
  if (canvas) {
    const link = document.createElement('a');
    const label = document.getElementById('qr-label').textContent;
    link.download = `${label}-qr.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('QR code downloaded.', 'success');
  } else {
    showToast('No QR code to download.', 'error');
  }
}

function exportSingleJSON(id) {
  const archive = getArchive(id);
  if (!archive) return;

  const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${archive.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`JSON exported: ${archive.id}.json`, 'success');
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================
// UTILITIES
// ============================================================
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function updateSidebarStats() {
  const total = getArchivesCount();
  document.getElementById('sidebar-total').textContent = `${total} archive${total !== 1 ? 's' : ''}`;
}

function toggleDarkMode(enable) {
  state.isDarkMode = enable;
  document.documentElement.classList.toggle('dark', enable);
  localStorage.setItem(STORAGE_KEY_DARK_MODE, enable);
}

function togglePrintMode(enable) {
  state.isPrintMode = enable;
  document.body.classList.toggle('print-mode', enable);
  localStorage.setItem(STORAGE_KEY_PRINT_MODE, enable);
}

// ============================================================
// DELETE MODAL
// ============================================================
let pendingDeleteId = null;

function showDeleteModal(archiveId) {
  pendingDeleteId = archiveId;
  const archive = getArchive(archiveId);
  document.getElementById('delete-modal-text').textContent =
    `Are you sure you want to delete ${archive ? archive.id : 'this archive'}? This action cannot be undone.`;
  document.getElementById('delete-modal').classList.remove('hidden');
}

function confirmDelete() {
  if (pendingDeleteId) {
    const id = pendingDeleteId;
    deleteArchive(id);
    document.getElementById('delete-modal').classList.add('hidden');
    showToast(`Archive ${id} deleted.`, 'info');
    pendingDeleteId = null;
    navigateTo('archives');
    updateSidebarStats();
  }
}

// ============================================================
// EVENT BINDING
// ============================================================
function bindEvents() {
  // --- Navigation ---
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page === 'archive-form') {
        navigateTo(page, {});
      } else {
        navigateTo(page);
      }
    });
  });

  // --- Form Submit ---
  document.getElementById('archive-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('form-cancel').addEventListener('click', () => {
    if (state.editingArchiveId) {
      navigateTo('archive-detail', { id: state.editingArchiveId });
    } else {
      navigateTo('archives');
    }
  });

  // --- Star Rating ---
  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.dataset.value);
      document.getElementById('field-importance').value = value;
      document.querySelectorAll('.star').forEach(s => {
        const val = parseInt(s.dataset.value);
        s.classList.toggle('active', val <= value);
        s.textContent = val <= value ? '★' : '☆';
      });
    });

    star.addEventListener('mouseenter', () => {
      const value = parseInt(star.dataset.value);
      document.querySelectorAll('.star').forEach(s => {
        const val = parseInt(s.dataset.value);
        if (val <= value) {
          s.style.color = 'var(--gold)';
        } else {
          s.style.color = 'var(--border-light)';
        }
      });
    });

    star.addEventListener('mouseleave', () => {
      const currentValue = parseInt(document.getElementById('field-importance').value);
      document.querySelectorAll('.star').forEach(s => {
        const val = parseInt(s.dataset.value);
        s.style.color = val <= currentValue ? 'var(--gold)' : 'var(--border-light)';
      });
    });
  });

  // --- Search & Filters (Archives) ---
  const searchInput = document.getElementById('search-input');
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchQuery = searchInput.value;
      renderArchivesList();
    }, 250);
  });

  document.getElementById('filter-category').addEventListener('change', e => {
    state.filterCategory = e.target.value;
    renderArchivesList();
  });

  document.getElementById('filter-importance').addEventListener('change', e => {
    state.filterImportance = e.target.value;
    renderArchivesList();
  });

  document.getElementById('filter-sort').addEventListener('change', e => {
    state.filterSort = e.target.value;
    renderArchivesList();
  });

  // --- Detail Actions ---
  document.getElementById('detail-back').addEventListener('click', () => navigateTo('archives'));
  document.getElementById('detail-edit').addEventListener('click', () => {
    navigateTo('archive-form', { editId: state.currentArchiveId });
  });
  document.getElementById('detail-delete').addEventListener('click', () => {
    showDeleteModal(state.currentArchiveId);
  });

  // --- Export Actions ---
  document.getElementById('export-png').addEventListener('click', exportPNG);
  document.getElementById('export-pdf').addEventListener('click', exportPDF);
  document.getElementById('export-qr').addEventListener('click', () => {
    if (state.currentArchiveId) showQR(state.currentArchiveId);
  });
  document.getElementById('export-json-single').addEventListener('click', () => {
    if (state.currentArchiveId) exportSingleJSON(state.currentArchiveId);
  });

  // --- QR Modal ---
  document.getElementById('qr-close').addEventListener('click', () => {
    document.getElementById('qr-modal').classList.add('hidden');
  });
  document.getElementById('qr-download').addEventListener('click', downloadQR);

  // --- Delete Modal ---
  document.getElementById('delete-modal-close').addEventListener('click', () => {
    document.getElementById('delete-modal').classList.add('hidden');
    pendingDeleteId = null;
  });
  document.getElementById('delete-modal-cancel').addEventListener('click', () => {
    document.getElementById('delete-modal').classList.add('hidden');
    pendingDeleteId = null;
  });
  document.getElementById('delete-modal-confirm').addEventListener('click', confirmDelete);

  // --- Vault ---
  document.getElementById('vault-new-entry').addEventListener('click', () => openVaultForm());
  document.getElementById('vault-search').addEventListener('input', e => {
    state.vaultSearch = e.target.value;
    renderVaultList();
  });

  // Vault Modal
  document.getElementById('vault-modal-close').addEventListener('click', () => {
    document.getElementById('vault-modal').classList.add('hidden');
  });
  document.getElementById('vault-form-cancel').addEventListener('click', () => {
    document.getElementById('vault-modal').classList.add('hidden');
  });
  document.getElementById('vault-form').addEventListener('submit', handleVaultFormSubmit);

  // Vault Detail Modal
  document.getElementById('vault-detail-close').addEventListener('click', () => {
    document.getElementById('vault-detail-modal').classList.add('hidden');
  });
  document.getElementById('vault-detail-edit').addEventListener('click', () => {
    document.getElementById('vault-detail-modal').classList.add('hidden');
    openVaultForm(state.currentVaultId);
  });
  document.getElementById('vault-detail-delete').addEventListener('click', () => {
    document.getElementById('vault-detail-modal').classList.add('hidden');
    deleteVaultEntryConfirm(state.currentVaultId);
  });

  // --- Timeline ---
  document.getElementById('timeline-year').addEventListener('change', e => {
    state.timelineYear = e.target.value;
    renderTimeline();
  });
  document.getElementById('timeline-category').addEventListener('change', e => {
    state.timelineCategory = e.target.value;
    renderTimeline();
  });

  // --- Settings ---
  document.getElementById('dark-mode-toggle').addEventListener('change', e => {
    toggleDarkMode(e.target.checked);
  });

  document.getElementById('print-mode-toggle').addEventListener('change', e => {
    togglePrintMode(e.target.checked);
  });

  document.getElementById('settings-export-json').addEventListener('click', exportAllJSON);
  document.getElementById('settings-import-json').addEventListener('change', e => {
    if (e.target.files.length > 0) {
      importJSON(e.target.files[0]);
      e.target.value = '';
    }
  });
  document.getElementById('settings-clear-all').addEventListener('click', clearAllData);

  // --- Close modals on overlay click ---
  document.querySelectorAll('.modal-overlay, .qr-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.add('hidden');
      }
    });
  });

  // Keyboard: Escape to close modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not(.hidden), .qr-modal-overlay:not(.hidden)').forEach(el => {
        el.classList.add('hidden');
      });
    }
  });
}

// ============================================================
// INIT
// ============================================================
function init() {
  loadData();

  // Apply dark mode
  if (state.isDarkMode) {
    document.documentElement.classList.add('dark');
    document.getElementById('dark-mode-toggle').checked = true;
  }

  if (state.isPrintMode) {
    document.body.classList.add('print-mode');
    document.getElementById('print-mode-toggle').checked = true;
  }

  bindEvents();
  navigateTo('dashboard');
  updateSidebarStats();
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
