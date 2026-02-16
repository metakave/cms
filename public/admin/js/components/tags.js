// Tags Management
async function renderTags(container, topbarActions) {
    topbarActions.innerHTML = `
    <button class="btn btn-primary" onclick="openTagModal()">
      <span>➕</span> New Tag
    </button>
  `;

    container.innerHTML = '<div class="spinner"></div>';

    try {
        const tags = await api.get('/api/tags');
        state.tags = tags;

        container.innerHTML = `
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tags.map(tag => `
                <tr>
                  <td><strong>${tag.name}</strong></td>
                  <td><code>${tag.slug}</code></td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-secondary btn-sm" onclick="editTag(${tag.id})">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteTag(${tag.id})">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Modal -->
      <div id="tagModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="tagModalTitle">New Tag</h2>
            <button class="modal-close" onclick="closeTagModal()">×</button>
          </div>
          <form id="tagForm">
            <input type="hidden" id="tagId">
            <div class="form-group">
              <label class="form-label">Name *</label>
              <input type="text" id="tagName" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Slug</label>
              <input type="text" id="tagSlug" class="form-input" placeholder="Auto-generated from name">
            </div>
            <div class="flex gap-2">
              <button type="submit" class="btn btn-primary">Save</button>
              <button type="button" class="btn btn-secondary" onclick="closeTagModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

        document.getElementById('tagForm').addEventListener('submit', saveTag);
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">Failed to load tags: ${error.message}</div>`;
    }
}

function openTagModal() {
    document.getElementById('tagModalTitle').textContent = 'New Tag';
    document.getElementById('tagForm').reset();
    document.getElementById('tagId').value = '';
    document.getElementById('tagModal').classList.add('active');
}

function closeTagModal() {
    document.getElementById('tagModal').classList.remove('active');
}

async function editTag(id) {
    const tag = state.tags.find(t => t.id === id);
    if (!tag) return;

    document.getElementById('tagModalTitle').textContent = 'Edit Tag';
    document.getElementById('tagId').value = tag.id;
    document.getElementById('tagName').value = tag.name;
    document.getElementById('tagSlug').value = tag.slug;
    document.getElementById('tagModal').classList.add('active');
}

async function saveTag(e) {
    e.preventDefault();

    const id = document.getElementById('tagId').value;
    const data = {
        name: document.getElementById('tagName').value,
        slug: document.getElementById('tagSlug').value
    };

    try {
        if (id) {
            await api.put(`/api/tags/${id}`, data);
            showAlert('Tag updated successfully');
        } else {
            await api.post('/api/tags', data);
            showAlert('Tag created successfully');
        }

        closeTagModal();
        loadPage('tags');
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deleteTag(id) {
    if (!confirmDelete('Are you sure you want to delete this tag?')) return;

    try {
        await api.delete(`/api/tags/${id}`);
        showAlert('Tag deleted successfully');
        loadPage('tags');
    } catch (error) {
        showAlert(error.message, 'error');
    }
}
