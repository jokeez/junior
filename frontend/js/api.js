// API клиент для работы с backend

const API_BASE_URL = 'http://localhost:3000/api';

const API = {
    // Blog API
    blog: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/blog`);
            return response.json();
        },

        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/blog/${id}`);
            return response.json();
        },

        create: async (data) => {
            const response = await fetch(`${API_BASE_URL}/blog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response.json();
        },

        update: async (id, data) => {
            const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response.json();
        },

        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
                method: 'DELETE'
            });
            return response.json();
        },

        search: async (query) => {
            const response = await fetch(`${API_BASE_URL}/blog/search/${encodeURIComponent(query)}`);
            return response.json();
        }
    },

    // Portfolio API
    portfolio: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/portfolio`);
            return response.json();
        },

        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/portfolio/${id}`);
            return response.json();
        },

        create: async (data) => {
            const response = await fetch(`${API_BASE_URL}/portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response.json();
        },

        update: async (id, data) => {
            const response = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response.json();
        },

        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
                method: 'DELETE'
            });
            return response.json();
        },

        getByCategory: async (category) => {
            const response = await fetch(`${API_BASE_URL}/portfolio/category/${encodeURIComponent(category)}`);
            return response.json();
        }
    }
};

