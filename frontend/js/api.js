// API клиент для работы с backend
// Автоматическое определение URL API
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : null; // На GitHub Pages API недоступен, используем localStorage

// Хранилище для блога и портфолио (если API недоступен)
const StorageAPI = {
    blog: {
        getAll: () => {
            const data = localStorage.getItem('blog_posts');
            return data ? JSON.parse(data) : [];
        },
        getById: (id) => {
            const posts = StorageAPI.blog.getAll();
            return posts.find(p => p.id === parseInt(id)) || null;
        },
        create: (data) => {
            const posts = StorageAPI.blog.getAll();
            const newPost = {
                id: Date.now(),
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            posts.push(newPost);
            localStorage.setItem('blog_posts', JSON.stringify(posts));
            return newPost;
        },
        update: (id, data) => {
            const posts = StorageAPI.blog.getAll();
            const index = posts.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                posts[index] = { ...posts[index], ...data, updated_at: new Date().toISOString() };
                localStorage.setItem('blog_posts', JSON.stringify(posts));
                return posts[index];
            }
            return null;
        },
        delete: (id) => {
            const posts = StorageAPI.blog.getAll();
            const filtered = posts.filter(p => p.id !== parseInt(id));
            localStorage.setItem('blog_posts', JSON.stringify(filtered));
            return { success: true };
        },
        search: (query) => {
            const posts = StorageAPI.blog.getAll();
            const lowerQuery = query.toLowerCase();
            return posts.filter(p => 
                p.title.toLowerCase().includes(lowerQuery) ||
                (p.content && p.content.toLowerCase().includes(lowerQuery))
            );
        }
    },
    portfolio: {
        getAll: () => {
            const data = localStorage.getItem('portfolio_items');
            return data ? JSON.parse(data) : [];
        },
        getById: (id) => {
            const items = StorageAPI.portfolio.getAll();
            return items.find(p => p.id === parseInt(id)) || null;
        },
        create: (data) => {
            const items = StorageAPI.portfolio.getAll();
            const newItem = {
                id: Date.now(),
                ...data,
                created_at: new Date().toISOString()
            };
            items.push(newItem);
            localStorage.setItem('portfolio_items', JSON.stringify(items));
            return newItem;
        },
        update: (id, data) => {
            const items = StorageAPI.portfolio.getAll();
            const index = items.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                items[index] = { ...items[index], ...data };
                localStorage.setItem('portfolio_items', JSON.stringify(items));
                return items[index];
            }
            return null;
        },
        delete: (id) => {
            const items = StorageAPI.portfolio.getAll();
            const filtered = items.filter(p => p.id !== parseInt(id));
            localStorage.setItem('portfolio_items', JSON.stringify(filtered));
            return { success: true };
        },
        getByCategory: (category) => {
            const items = StorageAPI.portfolio.getAll();
            return items.filter(p => p.category === category);
        }
    }
};

const API = {
    // Blog API
    blog: {
        getAll: async () => {
            if (!API_BASE_URL) return StorageAPI.blog.getAll();
            try {
                const response = await fetch(`${API_BASE_URL}/blog`);
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.blog.getAll();
            }
        },

        getById: async (id) => {
            if (!API_BASE_URL) return StorageAPI.blog.getById(id);
            try {
                const response = await fetch(`${API_BASE_URL}/blog/${id}`);
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.blog.getById(id);
            }
        },

        create: async (data) => {
            if (!API_BASE_URL) return StorageAPI.blog.create(data);
            try {
                const response = await fetch(`${API_BASE_URL}/blog`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.blog.create(data);
            }
        },

        update: async (id, data) => {
            if (!API_BASE_URL) return StorageAPI.blog.update(id, data);
            try {
                const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.blog.update(id, data);
            }
        },

        delete: async (id) => {
            if (!API_BASE_URL) return StorageAPI.blog.delete(id);
            try {
                const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
                    method: 'DELETE'
                });
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.blog.delete(id);
            }
        },

        search: async (query) => {
            if (!API_BASE_URL) return StorageAPI.blog.search(query);
            try {
                const response = await fetch(`${API_BASE_URL}/blog/search/${encodeURIComponent(query)}`);
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.blog.search(query);
            }
        }
    },

    // Portfolio API
    portfolio: {
        getAll: async () => {
            if (!API_BASE_URL) return StorageAPI.portfolio.getAll();
            try {
                const response = await fetch(`${API_BASE_URL}/portfolio`);
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.portfolio.getAll();
            }
        },

        getById: async (id) => {
            if (!API_BASE_URL) return StorageAPI.portfolio.getById(id);
            try {
                const response = await fetch(`${API_BASE_URL}/portfolio/${id}`);
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.portfolio.getById(id);
            }
        },

        create: async (data) => {
            if (!API_BASE_URL) return StorageAPI.portfolio.create(data);
            try {
                const response = await fetch(`${API_BASE_URL}/portfolio`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.portfolio.create(data);
            }
        },

        update: async (id, data) => {
            if (!API_BASE_URL) return StorageAPI.portfolio.update(id, data);
            try {
                const response = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.portfolio.update(id, data);
            }
        },

        delete: async (id) => {
            if (!API_BASE_URL) return StorageAPI.portfolio.delete(id);
            try {
                const response = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
                    method: 'DELETE'
                });
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.portfolio.delete(id);
            }
        },

        getByCategory: async (category) => {
            if (!API_BASE_URL) return StorageAPI.portfolio.getByCategory(category);
            try {
                const response = await fetch(`${API_BASE_URL}/portfolio/category/${encodeURIComponent(category)}`);
                return response.json();
            } catch (error) {
                console.warn('API недоступен, используем localStorage:', error);
                return StorageAPI.portfolio.getByCategory(category);
            }
        }
    }
};

