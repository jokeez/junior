// Страница достижений

let currentFilter = 'all';

function loadAchievements() {
    if (typeof AchievementsSystem === 'undefined') {
        console.error('AchievementsSystem не загружен');
        return;
    }
    
    const data = AchievementsSystem.getData();
    const achievements = AchievementsSystem.getAllAchievements();
    const unlocked = data.unlocked || [];

    // Обновление статистики (для таба достижений)
    const totalPointsEl = document.getElementById('totalPoints');
    const userLevelEl = document.getElementById('userLevel');
    const unlockedCountEl = document.getElementById('unlockedCount');
    const levelProgressFillEl = document.getElementById('levelProgressFill');
    const levelProgressTextEl = document.getElementById('levelProgressText');
    const currentLevelEl = document.getElementById('currentLevel');
    const nextLevelEl = document.getElementById('nextLevel');
    
    if (totalPointsEl) totalPointsEl.textContent = data.points || 0;
    if (userLevelEl) userLevelEl.textContent = data.level || 1;
    if (unlockedCountEl) unlockedCountEl.textContent = unlocked.length;

    // Прогресс до следующего уровня
    const progress = AchievementsSystem.getProgressToNextLevel();
    if (levelProgressFillEl) levelProgressFillEl.style.width = progress + '%';
    if (levelProgressTextEl) levelProgressTextEl.textContent = Math.round(progress) + '%';
    if (currentLevelEl) currentLevelEl.textContent = data.level || 1;
    if (nextLevelEl) nextLevelEl.textContent = (data.level || 1) + 1;

    // Фильтрация
    let filtered = achievements;
    if (currentFilter !== 'all') {
        filtered = achievements.filter(a => a.category === currentFilter);
    }

    // Рендеринг
    renderAchievements(filtered, unlocked);
}

function renderAchievements(achievements, unlocked) {
    const container = document.getElementById('achievementsContainer');
    if (!container) {
        console.error('Контейнер для достижений не найден! ID: achievementsContainer');
        return;
    }
    
    if (!achievements || achievements.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">Достижения не найдены. Проверьте загрузку AchievementsSystem.</p>';
        console.error('Список достижений пуст!');
        return;
    }
    
    console.log(`Рендеринг ${achievements.length} достижений, разблокировано: ${unlocked.length}`);
    
    // Сортируем достижения: сначала разблокированные, потом по категориям
    const sortedAchievements = [...achievements].sort((a, b) => {
        const aUnlocked = unlocked.includes(a.id);
        const bUnlocked = unlocked.includes(b.id);
        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return a.points - b.points; // По очкам
    });
    
    container.innerHTML = sortedAchievements.map(achievement => {
        const isUnlocked = unlocked.includes(achievement.id);
        const categoryName = achievement.category === 'beginner' ? 'Начало' :
                            achievement.category === 'streak' ? 'Стрики' :
                            achievement.category === 'progress' ? 'Прогресс' :
                            achievement.category === 'skills' ? 'Навыки' :
                            achievement.category === 'activity' ? 'Активность' :
                            achievement.category === 'social' ? 'Социальные' :
                            achievement.category === 'special' ? 'Специальные' : '';
        
        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}" data-category="${achievement.category}">
                <div class="achievement-icon">${achievement.icon || '🏆'}</div>
                <div class="achievement-info">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <h3>${achievement.name || 'Без названия'}</h3>
                        ${categoryName ? `<span style="font-size: 0.75rem; color: var(--text-secondary); background: rgba(59, 130, 246, 0.2); padding: 0.25rem 0.5rem; border-radius: 12px;">${categoryName}</span>` : ''}
                    </div>
                    <p>${achievement.description || ''}</p>
                    <div class="achievement-meta">
                        <span class="achievement-points">${achievement.points || 0} очков</span>
                        ${isUnlocked ? '<span class="achievement-badge"><i class="fas fa-check"></i> Разблокировано</span>' : '<span style="color: var(--text-secondary); font-size: 0.875rem;">Заблокировано</span>'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterAchievements(category) {
    currentFilter = category;
    
    // Обновление активной кнопки
    const buttons = document.querySelectorAll('.achievements-filter .btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    loadAchievements();
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadAchievements();
});

