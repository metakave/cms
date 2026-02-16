// Pages Management
async function renderPages(container, topbarActions) {
  topbarActions.innerHTML = `
    <button class="btn btn-primary" onclick="openPageModal()">
      <span>➕</span> New Page
    </button>
  `;

  container.innerHTML = '<div class="spinner"></div>';

  try {
    const pages = await api.get('/api/pages');

    container.innerHTML = `
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Template</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${pages.map(page => `
                <tr>
                  <td><strong>${page.title}</strong></td>
                  <td><code>${page.slug}</code></td>
                  <td>${page.template}</td>
                  <td>
                    <span class="badge ${page.status === 'published' ? 'badge-success' : 'badge-warning'}">
                      ${page.status}
                    </span>
                  </td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-secondary btn-sm" onclick="editPage(${page.id})">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="deletePage(${page.id})">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Modal -->
      <div id="pageModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="pageModalTitle">New Page</h2>
            <button class="modal-close" onclick="closePageModal()">×</button>
          </div>
          <form id="pageForm">
            <input type="hidden" id="pageId">
            <div class="form-group">
              <label class="form-label">Title *</label>
              <input type="text" id="pageTitle" name="title" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Featured Image</label>
              <div class="flex gap-2">
                <input type="text" id="pageFeaturedImage" name="featured_image" class="form-input" placeholder="https://example.com/image.jpg">
                <input type="file" id="pageFeaturedImageFile" style="display: none;" onchange="uploadPageImage(this)">
                <button type="button" class="btn btn-secondary" onclick="document.getElementById('pageFeaturedImageFile').click()">Browse</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Slug</label>
              <input type="text" id="pageSlug" name="slug" class="form-input" placeholder="Auto-generated from title">
            </div>
            <div class="form-group">
              <label class="form-label">Content</label>
              <textarea id="pageContent" name="content" class="form-textarea" style="min-height: 200px;"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Template</label>
              <select id="pageTemplate" name="template" class="form-select">
                <option value="default">Default</option>
                <option value="full-width">Full Width</option>
                <option value="sidebar">With Sidebar</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select id="pageStatus" name="status" class="form-select">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button type="submit" class="btn btn-primary">Save</button>
              <button type="button" class="btn btn-secondary" onclick="closePageModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('pageForm').addEventListener('submit', savePage);
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">Failed to load pages: ${error.message}</div>`;
  }
}

function openPageModal() {
  document.getElementById('pageModalTitle').textContent = 'New Page';
  document.getElementById('pageForm').reset();
  document.getElementById('pageId').value = '';
  document.getElementById('pageFeaturedImage').value = '';
  document.getElementById('pageModal').classList.add('active');
}

async function uploadPageImage(input) {
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.url) {
      document.getElementById('pageFeaturedImage').value = data.url;
      showAlert('Image uploaded successfully');
    } else {
      throw new Error(data.error || 'Upload failed');
    }
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

function closePageModal() {
  document.getElementById('pageModal').classList.remove('active');
}

async function editPage(id) {
  try {
    const page = await api.get(`/api/pages/${id}`);

    document.getElementById('pageModalTitle').textContent = 'Edit Page';
    document.getElementById('pageId').value = page.id;
    document.getElementById('pageTitle').value = page.title;
    document.getElementById('pageFeaturedImage').value = page.featured_image || '';
    document.getElementById('pageSlug').value = page.slug;
    document.getElementById('pageContent').value = page.content || '';
    document.getElementById('pageTemplate').value = page.template;
    document.getElementById('pageStatus').value = page.status;
    document.getElementById('pageModal').classList.add('active');
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function savePage(e) {
  e.preventDefault();

  const id = document.getElementById('pageId').value;
  const data = {
    title: document.getElementById('pageTitle').value,
    featured_image: document.getElementById('pageFeaturedImage').value,
    slug: document.getElementById('pageSlug').value,
    content: document.getElementById('pageContent').value,
    template: document.getElementById('pageTemplate').value,
    status: document.getElementById('pageStatus').value
  };

  try {
    if (id) {
      await api.put(`/api/pages/${id}`, data);
      showAlert('Page updated successfully');
    } else {
      await api.post('/api/pages', data);
      showAlert('Page created successfully');
    }

    closePageModal();
    loadPage('pages');
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function deletePage(id) {
  if (!confirmDelete('Are you sure you want to delete this page?')) return;

  try {
    await api.delete(`/api/pages/${id}`);
    showAlert('Page deleted successfully');
    loadPage('pages');
  } catch (error) {
    showAlert(error.message, 'error');
  }
}
