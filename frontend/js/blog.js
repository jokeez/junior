// Функционал блога

let blogPosts = [];
let editingPostId = null;

// Загрузка статей
async function loadBlogPosts() {
    try {
        blogPosts = await API.blog.getAll();
        renderBlogPosts();
    } catch (error) {
        console.error('Ошибка загрузки статей:', error);
        document.getElementById('blogPostsContainer').innerHTML = 
            '<p style="color: red;">Ошибка загрузки статей. Убедитесь, что backend сервер запущен.</p>';
    }
}

// Рендеринг статей
function renderBlogPosts() {
    const container = document.getElementById('blogPostsContainer');
    if (!container) {
        console.warn('Контейнер для статей блога не найден');
        return;
    }
    
    if (blogPosts.length === 0) {
        container.innerHTML = '<p>Пока нет статей. Создайте первую статью!</p>';
        return;
    }

    container.innerHTML = blogPosts.map(post => `
        <div class="blog-post-card" onclick="viewPost(${post.id})">
            <h3 class="blog-post-title">${post.title}</h3>
            <div class="blog-post-meta">
                <span><i class="fas fa-calendar"></i> ${Utils.formatDate(post.created_at)}</span>
                ${post.category ? `<span><i class="fas fa-tag"></i> ${post.category}</span>` : ''}
            </div>
            <div class="blog-post-excerpt">
                ${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}
            </div>
            <div class="blog-post-actions">
                <button class="btn btn-secondary" onclick="event.stopPropagation(); editPost(${post.id})">
                    <i class="fas fa-edit"></i> Редактировать
                </button>
                <button class="btn btn-secondary" onclick="event.stopPropagation(); deletePost(${post.id})">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        </div>
    `).join('');
}

// Показать форму создания статьи
function showNewPostForm() {
    editingPostId = null;
    document.getElementById('modalTitle').textContent = 'Новая статья';
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    document.getElementById('postModal').classList.add('active');
}

// Редактировать статью
async function editPost(id) {
    try {
        const post = await API.blog.getById(id);
        editingPostId = id;
        document.getElementById('modalTitle').textContent = 'Редактировать статью';
        document.getElementById('postId').value = post.id;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postCategory').value = post.category || '';
        document.getElementById('postTags').value = post.tags || '';
        document.getElementById('postContent').value = post.markdown_content || post.content;
        document.getElementById('postModal').classList.add('active');
    } catch (error) {
        console.error('Ошибка загрузки статьи:', error);
        alert('Ошибка загрузки статьи');
    }
}

// Просмотр статьи
async function viewPost(id) {
    try {
        const post = await API.blog.getById(id);
        
        if (typeof marked === 'undefined') {
            console.error('Marked.js не загружен');
            alert('Ошибка: библиотека Marked не загружена');
            return;
        }
        
        const content = marked.parse(post.markdown_content || post.content);
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2>${post.title}</h2>
                <div class="blog-post-meta">
                    <span><i class="fas fa-calendar"></i> ${Utils.formatDate(post.created_at)}</span>
                    ${post.category ? `<span><i class="fas fa-tag"></i> ${post.category}</span>` : ''}
                </div>
                <div class="blog-post-content" style="margin-top: 1.5rem;">
                    ${content}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Ошибка загрузки статьи:', error);
        alert('Ошибка загрузки статьи');
    }
}

// Удалить статью
async function deletePost(id) {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) return;
    
    try {
        await API.blog.delete(id);
        loadBlogPosts();
    } catch (error) {
        console.error('Ошибка удаления статьи:', error);
        alert('Ошибка удаления статьи');
    }
}

// Закрыть модальное окно
function closePostModal() {
    document.getElementById('postModal').classList.remove('active');
    editingPostId = null;
}

// Сохранение статьи
const postForm = document.getElementById('postForm');
if (postForm) {
    postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        markdown_content: document.getElementById('postContent').value,
        category: document.getElementById('postCategory').value,
        tags: document.getElementById('postTags').value
    };

    try {
        if (editingPostId) {
            await API.blog.update(editingPostId, data);
        } else {
            await API.blog.create(data);
            
            // Проверка достижений блога
            if (typeof AchievementsSystem !== 'undefined') {
                try {
                    const blogPosts = await API.blog.getAll();
                    if (blogPosts.length === 1) {
                        AchievementsSystem.checkAchievement('blogger');
                    } else if (blogPosts.length === 5) {
                        AchievementsSystem.checkAchievement('blogger_5');
                    } else if (blogPosts.length === 10) {
                        AchievementsSystem.checkAchievement('blogger_10');
                    }
                } catch (e) {
                    console.warn('Ошибка проверки достижений блога:', e);
                }
            }
        }
        closePostModal();
        loadBlogPosts();
    } catch (error) {
        console.error('Ошибка сохранения статьи:', error);
        alert('Ошибка сохранения статьи');
    }
    });
}

// Поиск
function searchBlog() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) {
        console.warn('Поле поиска не найдено');
        return;
    }
    
    const query = searchInput.value;
    if (!query.trim()) {
        renderBlogPosts();
        return;
    }

    if (typeof API === 'undefined' || !API.blog) {
        console.error('API не загружен');
        return;
    }

    API.blog.search(query)
        .then(posts => {
            blogPosts = posts;
            renderBlogPosts();
        })
        .catch(error => {
            console.error('Ошибка поиска:', error);
            alert('Ошибка поиска статей');
        });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
});

