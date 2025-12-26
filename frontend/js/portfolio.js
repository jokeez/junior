// Функционал портфолио

let portfolioItems = [];
let editingProjectId = null;

// Загрузка проектов
async function loadPortfolio() {
    try {
        portfolioItems = await API.portfolio.getAll();
        renderPortfolio();
    } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
        document.getElementById('portfolioContainer').innerHTML = 
            '<p style="color: red;">Ошибка загрузки проектов. Убедитесь, что backend сервер запущен.</p>';
    }
}

// Рендеринг проектов
function renderPortfolio() {
    const container = document.getElementById('portfolioContainer');
    if (!container) {
        console.warn('Контейнер для портфолио не найден');
        return;
    }
    
    if (portfolioItems.length === 0) {
        container.innerHTML = '<p>Пока нет проектов. Добавьте первый проект!</p>';
        return;
    }

    container.innerHTML = portfolioItems.map(item => `
        <div class="portfolio-item">
            ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" class="portfolio-image" onerror="this.style.display='none'">` : ''}
            <div class="portfolio-content">
                <h3 class="portfolio-title">${item.title}</h3>
                ${item.description ? `<p class="portfolio-description">${item.description}</p>` : ''}
                ${item.technologies ? `
                    <div class="portfolio-technologies">
                        ${item.technologies.split(',').map(tech => 
                            `<span class="tech-tag">${tech.trim()}</span>`
                        ).join('')}
                    </div>
                ` : ''}
                <div class="portfolio-links">
                    ${item.github_url ? `<a href="${item.github_url}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                    ${item.demo_url ? `<a href="${item.demo_url}" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                    <a href="#" onclick="event.preventDefault(); editProject(${item.id})"><i class="fas fa-edit"></i> Редактировать</a>
                    <a href="#" onclick="event.preventDefault(); deleteProject(${item.id})" style="color: var(--danger-color);"><i class="fas fa-trash"></i> Удалить</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Показать форму создания проекта
function showNewProjectForm() {
    editingProjectId = null;
    document.getElementById('modalTitle').textContent = 'Новый проект';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    document.getElementById('projectModal').classList.add('active');
}

// Редактировать проект
async function editProject(id) {
    try {
        const project = await API.portfolio.getById(id);
        editingProjectId = id;
        document.getElementById('modalTitle').textContent = 'Редактировать проект';
        document.getElementById('projectId').value = project.id;
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description || '';
        document.getElementById('projectGithub').value = project.github_url || '';
        document.getElementById('projectDemo').value = project.demo_url || '';
        document.getElementById('projectImage').value = project.image_url || '';
        document.getElementById('projectTechnologies').value = project.technologies || '';
        document.getElementById('projectCategory').value = project.category || '';
        document.getElementById('projectModal').classList.add('active');
    } catch (error) {
        console.error('Ошибка загрузки проекта:', error);
        alert('Ошибка загрузки проекта');
    }
}

// Удалить проект
async function deleteProject(id) {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) return;
    
    try {
        await API.portfolio.delete(id);
        loadPortfolio();
    } catch (error) {
        console.error('Ошибка удаления проекта:', error);
        alert('Ошибка удаления проекта');
    }
}

// Закрыть модальное окно
function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
    editingProjectId = null;
}

// Фильтрация по категории
function filterPortfolio() {
    const category = document.getElementById('categoryFilter').value;
    
    if (category === 'all') {
        renderPortfolio();
        return;
    }

    API.portfolio.getByCategory(category)
        .then(items => {
            portfolioItems = items;
            renderPortfolio();
        })
        .catch(error => {
            console.error('Ошибка фильтрации:', error);
        });
}

// Сохранение проекта
const projectForm = document.getElementById('projectForm');
if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        title: document.getElementById('projectTitle').value,
        description: document.getElementById('projectDescription').value,
        github_url: document.getElementById('projectGithub').value,
        demo_url: document.getElementById('projectDemo').value,
        image_url: document.getElementById('projectImage').value,
        technologies: document.getElementById('projectTechnologies').value,
        category: document.getElementById('projectCategory').value
    };

    try {
        if (editingProjectId) {
            await API.portfolio.update(editingProjectId, data);
        } else {
            await API.portfolio.create(data);
            
            // Проверка достижений портфолио
            if (typeof AchievementsSystem !== 'undefined') {
                try {
                    const portfolioItems = await API.portfolio.getAll();
                    if (portfolioItems.length === 1) {
                        AchievementsSystem.checkAchievement('portfolio');
                    } else if (portfolioItems.length === 3) {
                        AchievementsSystem.checkAchievement('portfolio_3');
                    } else if (portfolioItems.length === 5) {
                        AchievementsSystem.checkAchievement('portfolio_5');
                    }
                } catch (e) {
                    console.warn('Ошибка проверки достижений портфолио:', e);
                }
            }
        }
        closeProjectModal();
        loadPortfolio();
    } catch (error) {
        console.error('Ошибка сохранения проекта:', error);
        alert('Ошибка сохранения проекта');
    }
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolio();
});

