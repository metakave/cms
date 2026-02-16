// Menu Management
async function renderMenus(container, topbarActions) {
    topbarActions.innerHTML = `
    <button class="btn btn-primary" onclick="openMenuModal()">
      <span>➕</span> New Menu Item
    </button>
  `;

    container.innerHTML = '<div class="spinner"></div>';

    try {
        const [menus, pagesRaw] = await Promise.all([
            api.get('/api/menus'),
            api.get('/api/pages')
        ]);

        // Build hierarchy for display
        const hierarchy = buildMenuHierarchy(menus);

        container.innerHTML = `
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Label</th>
                <th>Type</th>
                <th>Target</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${renderMenuRows(hierarchy)}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Modal -->
      <div id="menuModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="menuModalTitle">New Menu Item</h2>
            <button class="modal-close" onclick="closeMenuModal()">×</button>
          </div>
          <form id="menuForm">
            <input type="hidden" id="menuId">
            
            <div class="form-group">
              <label class="form-label">Label *</label>
              <input type="text" id="menuLabel" name="label" class="form-input" required>
            </div>

            <div class="form-group">
              <label class="form-label">Type</label>
              <select id="menuType" name="type" class="form-select" onchange="toggleMenuType()">
                <option value="page">Page</option>
                <option value="custom">Custom Link</option>
              </select>
            </div>

            <div class="form-group" id="groupPageSelect">
              <label class="form-label">Select Page</label>
              <select id="menuPageId" name="page_id" class="form-select">
                <option value="">-- Choose a Page --</option>
                ${pagesRaw.map(p => `<option value="${p.id}">${p.title}</option>`).join('')}
              </select>
            </div>

            <div class="form-group" id="groupUrl" style="display:none;">
              <label class="form-label">URL</label>
              <input type="text" id="menuUrl" name="url" class="form-input" placeholder="https://...">
            </div>

            <div class="form-group">
              <label class="form-label">Parent Item</label>
              <select id="menuParentId" name="parent_id" class="form-select">
                <option value="">(No Parent)</option>
                ${renderParentOptions(hierarchy)}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Order Index</label>
              <input type="number" id="menuOrder" name="order_index" class="form-input" value="0">
            </div>

            <div class="flex gap-2">
              <button type="submit" class="btn btn-primary">Save</button>
              <button type="button" class="btn btn-secondary" onclick="closeMenuModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

        document.getElementById('menuForm').addEventListener('submit', saveMenu);
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">Failed to load menus: ${error.message}</div>`;
    }
}

function buildMenuHierarchy(items, parentId = null) {
    return items
        .filter(item => item.parent_id === parentId)
        .sort((a, b) => a.order_index - b.order_index)
        .map(item => ({
            ...item,
            children: buildMenuHierarchy(items, item.id)
        }));
}

function renderMenuRows(items, level = 0) {
    return items.map(item => `
    <tr>
      <td>
        <div style="padding-left: ${level * 24}px; display: flex; align-items: center;">
          ${level > 0 ? '↳ ' : ''} <strong>${item.label}</strong>
        </div>
      </td>
      <td><span class="badge badge-secondary">${item.type}</span></td>
      <td><code style="font-size: 12px;">${item.type === 'page' ? `Page ID: ${item.page_id}` : item.url}</code></td>
      <td>${item.order_index}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-secondary btn-sm" onclick="editMenu(${item.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteMenu(${item.id})">Delete</button>
        </div>
      </td>
    </tr>
    ${renderMenuRows(item.children, level + 1)}
  `).join('');
}

function renderParentOptions(items, level = 0, excludeId = null) {
    return items.map(item => {
        // Prevent setting self or children as parent to avoid cycles
        if (item.id === excludeId) return '';

        return `
      <option value="${item.id}">
        ${'&nbsp;&nbsp;'.repeat(level)} ${item.label}
      </option>
      ${renderParentOptions(item.children, level + 1, excludeId)}
    `;
    }).join('');
}

function toggleMenuType() {
    const type = document.getElementById('menuType').value;
    document.getElementById('groupPageSelect').style.display = type === 'page' ? 'block' : 'none';
    document.getElementById('groupUrl').style.display = type === 'custom' ? 'block' : 'none';
}

function openMenuModal() {
    document.getElementById('menuModalTitle').textContent = 'New Menu Item';
    document.getElementById('menuForm').reset();
    document.getElementById('menuId').value = '';
    toggleMenuType();
    document.getElementById('menuModal').classList.add('active');
}

function closeMenuModal() {
    document.getElementById('menuModal').classList.remove('active');
}

async function editMenu(id) {
    try {
        const [menus, pages] = await Promise.all([
            api.get('/api/menus'), // fetch fresh list for parent options
            api.get('/api/pages')
        ]);
        const item = menus.find(m => m.id === id); // We fetched all, so find locally or fetch single if API supported

        // Re-render parent options excluding self
        const hierarchy = buildMenuHierarchy(menus);
        const parentSelect = document.getElementById('menuParentId');
        parentSelect.innerHTML = `<option value="">(No Parent)</option>` + renderParentOptions(hierarchy, 0, id);

        document.getElementById('menuModalTitle').textContent = 'Edit Menu Item';
        document.getElementById('menuId').value = item.id;
        document.getElementById('menuLabel').value = item.label;
        document.getElementById('menuType').value = item.type;
        document.getElementById('menuPageId').value = item.page_id || '';
        document.getElementById('menuUrl').value = item.url || '';
        document.getElementById('menuParentId').value = item.parent_id || '';
        document.getElementById('menuOrder').value = item.order_index;

        toggleMenuType();
        document.getElementById('menuModal').classList.add('active');
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function saveMenu(e) {
    e.preventDefault();

    const id = document.getElementById('menuId').value;
    const data = {
        label: document.getElementById('menuLabel').value,
        type: document.getElementById('menuType').value,
        page_id: document.getElementById('menuPageId').value || null,
        url: document.getElementById('menuUrl').value,
        parent_id: document.getElementById('menuParentId').value || null,
        order_index: document.getElementById('menuOrder').value
    };

    try {
        if (id) {
            await api.put(`/api/menus/${id}`, data);
            showAlert('Menu updated successfully');
        } else {
            await api.post('/api/menus', data);
            showAlert('Menu created successfully');
        }

        closeMenuModal();
        loadPage('menus');
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deleteMenu(id) {
    if (!confirmDelete('Are you sure? This will delete sub-items too.')) return;

    try {
        await api.delete(`/api/menus/${id}`);
        showAlert('Menu deleted successfully');
        loadPage('menus');
    } catch (error) {
        showAlert(error.message, 'error');
    }
}
