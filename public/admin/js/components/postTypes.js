// Post Types Management
async function renderPostTypes(container, topbarActions) {
    topbarActions.innerHTML = `
    <button class="btn btn-primary" onclick="openPostTypeModal()">
      <span>➕</span> New Post Type
    </button>
  `;

    container.innerHTML = '<div class="spinner"></div>';

    try {
        const postTypes = await api.get('/api/post-types');
        state.postTypes = postTypes;

        container.innerHTML = `
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${postTypes.map(pt => `
                <tr>
                  <td style="font-size: 1.5rem;">${pt.icon}</td>
                  <td><strong>${pt.name}</strong></td>
                  <td><code>${pt.slug}</code></td>
                  <td class="text-muted">${pt.description || '-'}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-secondary btn-sm" onclick="editPostType(${pt.id})">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="deletePostType(${pt.id})">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Modal -->
      <div id="postTypeModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="postTypeModalTitle">New Post Type</h2>
            <button class="modal-close" onclick="closePostTypeModal()">×</button>
          </div>
          <form id="postTypeForm">
            <input type="hidden" id="postTypeId">
            <div class="form-group">
              <label class="form-label">Name *</label>
              <input type="text" id="postTypeName" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Slug</label>
              <input type="text" id="postTypeSlug" class="form-input" placeholder="Auto-generated from name">
            </div>
            <div class="form-group">
              <label class="form-label">Icon</label>
              <input type="text" id="postTypeIcon" class="form-input" placeholder="📄">
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea id="postTypeDescription" class="form-textarea"></textarea>
            </div>
            <div class="flex gap-2">
              <button type="submit" class="btn btn-primary">Save</button>
              <button type="button" class="btn btn-secondary" onclick="closePostTypeModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

        // Form submit handler
        document.getElementById('postTypeForm').addEventListener('submit', savePostType);
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">Failed to load post types: ${error.message}</div>`;
    }
}

function openPostTypeModal() {
    document.getElementById('postTypeModalTitle').textContent = 'New Post Type';
    document.getElementById('postTypeForm').reset();
    document.getElementById('postTypeId').value = '';
    document.getElementById('postTypeModal').classList.add('active');
}

function closePostTypeModal() {
    document.getElementById('postTypeModal').classList.remove('active');
}

async function editPostType(id) {
    const postType = state.postTypes.find(pt => pt.id === id);
    if (!postType) return;

    document.getElementById('postTypeModalTitle').textContent = 'Edit Post Type';
    document.getElementById('postTypeId').value = postType.id;
    document.getElementById('postTypeName').value = postType.name;
    document.getElementById('postTypeSlug').value = postType.slug;
    document.getElementById('postTypeIcon').value = postType.icon;
    document.getElementById('postTypeDescription').value = postType.description || '';
    document.getElementById('postTypeModal').classList.add('active');
}

async function savePostType(e) {
    e.preventDefault();

    const id = document.getElementById('postTypeId').value;
    const data = {
        name: document.getElementById('postTypeName').value,
        slug: document.getElementById('postTypeSlug').value,
        icon: document.getElementById('postTypeIcon').value || '📄',
        description: document.getElementById('postTypeDescription').value
    };

    try {
        if (id) {
            await api.put(`/api/post-types/${id}`, data);
            showAlert('Post type updated successfully');
        } else {
            await api.post('/api/post-types', data);
            showAlert('Post type created successfully');
        }

        closePostTypeModal();
        loadPage('post-types');
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deletePostType(id) {
    if (!confirmDelete('Are you sure you want to delete this post type?')) return;

    try {
        await api.delete(`/api/post-types/${id}`);
        showAlert('Post type deleted successfully');
        loadPage('post-types');
    } catch (error) {
        showAlert(error.message, 'error');
    }
}
