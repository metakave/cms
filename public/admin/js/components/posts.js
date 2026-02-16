// Posts Management
async function renderPosts(container, topbarActions) {
  topbarActions.innerHTML = `
    <button class="btn btn-primary" onclick="openPostModal()">
      <span>➕</span> New Post
    </button>
  `;

  container.innerHTML = '<div class="spinner"></div>';

  try {
    // Load dependencies
    const [posts, postTypes, categories, tags] = await Promise.all([
      api.get('/api/posts'),
      api.get('/api/post-types'),
      api.get('/api/categories'),
      api.get('/api/tags')
    ]);

    state.postTypes = postTypes;
    state.categories = categories;
    state.tags = tags;

    container.innerHTML = `
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Post Type</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Categories</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${posts.map(post => `
                <tr>
                  <td><strong>${post.title}</strong></td>
                  <td>${post.post_type_name}</td>
                  <td><code>${post.slug}</code></td>
                  <td>
                    <span class="badge ${post.status === 'published' ? 'badge-success' : 'badge-warning'}">
                      ${post.status}
                    </span>
                  </td>
                  <td class="text-muted">${post.categories?.map(c => c.name).join(', ') || '-'}</td>
                  <td class="text-muted">${post.tags?.map(t => t.name).join(', ') || '-'}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-secondary btn-sm" onclick="editPost(${post.id})">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="deletePost(${post.id})">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Modal -->
      <div id="postModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="postModalTitle">New Post</h2>
            <button class="modal-close" onclick="closePostModal()">×</button>
          </div>
          <form id="postForm">
            <input type="hidden" id="postId">
            <div class="form-group">
              <label class="form-label">Title *</label>
              <input type="text" id="postTitle" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Featured Image URL</label>
              <input type="text" id="postFeaturedImage" class="form-input" placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group">
              <label class="form-label">Slug</label>
              <input type="text" id="postSlug" class="form-input" placeholder="Auto-generated from title">
            </div>
            <div class="form-group">
              <label class="form-label">Post Type *</label>
              <select id="postTypeId" class="form-select" required>
                <option value="">Select post type</option>
                ${postTypes.map(pt => `<option value="${pt.id}">${pt.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Content</label>
              <div id="postContent" style="min-height: 200px; background: white;"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Excerpt</label>
              <textarea id="postExcerpt" class="form-textarea"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select id="postStatus" class="form-select">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Categories</label>
              <div id="postCategories" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px;">
                ${categories.map(cat => `
                  <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="checkbox" name="categories" value="${cat.id}">
                    <span>${cat.name}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Tags</label>
              <div id="postTags" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px;">
                ${tags.map(tag => `
                  <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="checkbox" name="tags" value="${tag.id}">
                    <span>${tag.name}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            <div class="flex gap-2">
              <button type="submit" class="btn btn-primary">Save</button>
              <button type="button" class="btn btn-secondary" onclick="closePostModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('postForm').addEventListener('submit', savePost);

    // Initialize Quill editor
    window.quillEditor = new Quill('#postContent', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'color': [] }, { 'background': [] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">Failed to load posts: ${error.message}</div>`;
  }
}

function openPostModal() {
  document.getElementById('postModalTitle').textContent = 'New Post';
  document.getElementById('postForm').reset();
  document.getElementById('postId').value = '';
  document.getElementById('postFeaturedImage').value = '';
  if (window.quillEditor) {
    window.quillEditor.setContents([]);
  }
  document.querySelectorAll('#postCategories input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('#postTags input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.getElementById('postModal').classList.add('active');
}

function closePostModal() {
  document.getElementById('postModal').classList.remove('active');
}

async function editPost(id) {
  try {
    const post = await api.get(`/api/posts/${id}`);

    document.getElementById('postModalTitle').textContent = 'Edit Post';
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postFeaturedImage').value = post.featured_image || '';
    document.getElementById('postSlug').value = post.slug;
    document.getElementById('postTypeId').value = post.post_type_id;
    if (window.quillEditor) {
      window.quillEditor.root.innerHTML = post.content || '';
    }
    document.getElementById('postExcerpt').value = post.excerpt || '';
    document.getElementById('postStatus').value = post.status;

    // Set categories
    const categoryIds = post.categories?.map(c => c.id) || [];
    document.querySelectorAll('#postCategories input[type="checkbox"]').forEach(cb => {
      cb.checked = categoryIds.includes(parseInt(cb.value));
    });

    // Set tags
    const tagIds = post.tags?.map(t => t.id) || [];
    document.querySelectorAll('#postTags input[type="checkbox"]').forEach(cb => {
      cb.checked = tagIds.includes(parseInt(cb.value));
    });

    document.getElementById('postModal').classList.add('active');
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function savePost(e) {
  e.preventDefault();

  const id = document.getElementById('postId').value;

  const categoryIds = Array.from(document.querySelectorAll('#postCategories input[type="checkbox"]:checked'))
    .map(cb => parseInt(cb.value));

  const tagIds = Array.from(document.querySelectorAll('#postTags input[type="checkbox"]:checked'))
    .map(cb => parseInt(cb.value));

  const data = {
    title: document.getElementById('postTitle').value,
    featured_image: document.getElementById('postFeaturedImage').value,
    slug: document.getElementById('postSlug').value,
    post_type_id: parseInt(document.getElementById('postTypeId').value),
    content: window.quillEditor ? window.quillEditor.root.innerHTML : '',
    excerpt: document.getElementById('postExcerpt').value,
    status: document.getElementById('postStatus').value,
    category_ids: categoryIds,
    tag_ids: tagIds
  };

  try {
    if (id) {
      await api.put(`/api/posts/${id}`, data);
      showAlert('Post updated successfully');
    } else {
      await api.post('/api/posts', data);
      showAlert('Post created successfully');
    }

    closePostModal();
    loadPage('posts');
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function deletePost(id) {
  if (!confirmDelete('Are you sure you want to delete this post?')) return;

  try {
    await api.delete(`/api/posts/${id}`);
    showAlert('Post deleted successfully');
    loadPage('posts');
  } catch (error) {
    showAlert(error.message, 'error');
  }
}
