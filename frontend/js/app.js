// Главный файл приложения

// Инициализация навигации
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    
    // Проверка достижения "Добро пожаловать" при первом открытии
    if (typeof AchievementsSystem !== 'undefined') {
        const welcomeKey = 'welcome_shown';
        if (!localStorage.getItem(welcomeKey)) {
            AchievementsSystem.checkAchievement('welcome');
            localStorage.setItem(welcomeKey, 'true');
        }
    }
});

function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Утилиты
const Utils = {
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatDateTime: (date) => {
        return new Date(date).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

