// Categories Management
async function renderCategories(container, topbarActions) {
    topbarActions.innerHTML = `
    <button class="btn btn-primary" onclick="openCategoryModal()">
      <span>➕</span> New Category
    </button>
  `;

    container.innerHTML = '<div class="spinner"></div>';

    try {
        const categories = await api.get('/api/categories');
        state.categories = categories;

        container.innerHTML = `
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${categories.map(cat => `
                <tr>
                  <td><strong>${cat.name}</strong></td>
                  <td><code>${cat.slug}</code></td>
                  <td class="text-muted">${cat.description || '-'}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-secondary btn-sm" onclick="editCategory(${cat.id})">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteCategory(${cat.id})">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Modal -->
      <div id="categoryModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="categoryModalTitle">New Category</h2>
            <button class="modal-close" onclick="closeCategoryModal()">×</button>
          </div>
          <form id="categoryForm">
            <input type="hidden" id="categoryId">
            <div class="form-group">
              <label class="form-label">Name *</label>
              <input type="text" id="categoryName" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Slug</label>
              <input type="text" id="categorySlug" class="form-input" placeholder="Auto-generated from name">
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea id="categoryDescription" class="form-textarea"></textarea>
            </div>
            <div class="flex gap-2">
              <button type="submit" class="btn btn-primary">Save</button>
              <button type="button" class="btn btn-secondary" onclick="closeCategoryModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

        document.getElementById('categoryForm').addEventListener('submit', saveCategory);
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">Failed to load categories: ${error.message}</div>`;
    }
}

function openCategoryModal() {
    document.getElementById('categoryModalTitle').textContent = 'New Category';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryModal').classList.add('active');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
}

async function editCategory(id) {
    const category = state.categories.find(c => c.id === id);
    if (!category) return;

    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categorySlug').value = category.slug;
    document.getElementById('categoryDescription').value = category.description || '';
    document.getElementById('categoryModal').classList.add('active');
}

async function saveCategory(e) {
    e.preventDefault();

    const id = document.getElementById('categoryId').value;
    const data = {
        name: document.getElementById('categoryName').value,
        slug: document.getElementById('categorySlug').value,
        description: document.getElementById('categoryDescription').value
    };

    try {
        if (id) {
            await api.put(`/api/categories/${id}`, data);
            showAlert('Category updated successfully');
        } else {
            await api.post('/api/categories', data);
            showAlert('Category created successfully');
        }

        closeCategoryModal();
        loadPage('categories');
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deleteCategory(id) {
    if (!confirmDelete('Are you sure you want to delete this category?')) return;

    try {
        await api.delete(`/api/categories/${id}`);
        showAlert('Category deleted successfully');
        loadPage('categories');
    } catch (error) {
        showAlert(error.message, 'error');
    }
}
