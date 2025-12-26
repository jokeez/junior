// Система достижений и бейджей

const AchievementsSystem = {
    STORAGE_KEY: 'cybersecurity_achievements',
    
    achievements: [
        // ========== ПЕРВЫЕ ШАГИ (BEGINNER) ==========
        { id: 'first_task', name: 'Первое задание', description: 'Выполните первое задание', icon: '🎯', points: 10, category: 'beginner' },
        { id: 'first_day', name: 'Первый день', description: 'Завершите первый день обучения', icon: '📅', points: 20, category: 'beginner' },
        { id: 'first_week', name: 'Первая неделя', description: 'Завершите первую неделю обучения', icon: '📆', points: 50, category: 'beginner' },
        { id: 'first_month', name: 'Первый месяц', description: 'Завершите первый месяц обучения', icon: '🗓️', points: 150, category: 'beginner' },
        { id: 'first_phase', name: 'Первая фаза', description: 'Завершите Фазу 0: Основы IT', icon: '🚀', points: 300, category: 'beginner' },
        { id: 'welcome', name: 'Добро пожаловать', description: 'Откройте платформу впервые', icon: '👋', points: 5, category: 'beginner' },
        { id: 'first_video', name: 'Первый просмотр', description: 'Посмотрите первое обучающее видео', icon: '📺', points: 15, category: 'beginner' },
        { id: 'first_cheatsheet', name: 'Первая шпаргалка', description: 'Откройте первую шпаргалку', icon: '📝', points: 10, category: 'beginner' },
        
        // ========== СТРИКИ (STREAK) ==========
        { id: 'streak_3', name: 'Три дня подряд', description: 'Занимайтесь 3 дня подряд', icon: '🔥', points: 30, category: 'streak' },
        { id: 'streak_5', name: 'Пять дней подряд', description: 'Занимайтесь 5 дней подряд', icon: '🔥🔥', points: 60, category: 'streak' },
        { id: 'streak_7', name: 'Неделя подряд', description: 'Занимайтесь 7 дней подряд', icon: '🔥🔥🔥', points: 100, category: 'streak' },
        { id: 'streak_14', name: 'Две недели подряд', description: 'Занимайтесь 14 дней подряд', icon: '🔥🔥🔥🔥', points: 250, category: 'streak' },
        { id: 'streak_21', name: 'Три недели подряд', description: 'Занимайтесь 21 день подряд', icon: '🔥🔥🔥🔥🔥', points: 400, category: 'streak' },
        { id: 'streak_30', name: 'Месяц подряд', description: 'Занимайтесь 30 дней подряд', icon: '🔥🔥🔥🔥🔥🔥', points: 500, category: 'streak' },
        { id: 'streak_60', name: 'Два месяца подряд', description: 'Занимайтесь 60 дней подряд', icon: '🔥🔥🔥🔥🔥🔥🔥', points: 1000, category: 'streak' },
        { id: 'streak_100', name: 'Легенда стриков', description: 'Занимайтесь 100 дней подряд', icon: '👑🔥', points: 2000, category: 'streak' },
        
        // ========== ПРОГРЕСС (PROGRESS) ==========
        { id: 'progress_10', name: '10% прогресса', description: 'Завершите 10% плана обучения', icon: '⭐', points: 50, category: 'progress' },
        { id: 'progress_25', name: '25% прогресса', description: 'Завершите 25% плана обучения', icon: '⭐⭐', points: 100, category: 'progress' },
        { id: 'progress_50', name: '50% прогресса', description: 'Завершите 50% плана обучения', icon: '⭐⭐⭐', points: 250, category: 'progress' },
        { id: 'progress_75', name: '75% прогресса', description: 'Завершите 75% плана обучения', icon: '⭐⭐⭐⭐', points: 500, category: 'progress' },
        { id: 'progress_90', name: '90% прогресса', description: 'Завершите 90% плана обучения', icon: '⭐⭐⭐⭐⭐', points: 750, category: 'progress' },
        { id: 'progress_100', name: 'Мастер', description: 'Завершите весь план обучения', icon: '👑', points: 1000, category: 'progress' },
        { id: 'tasks_10', name: '10 заданий', description: 'Выполните 10 заданий', icon: '✅', points: 25, category: 'progress' },
        { id: 'tasks_50', name: '50 заданий', description: 'Выполните 50 заданий', icon: '✅✅', points: 100, category: 'progress' },
        { id: 'tasks_100', name: '100 заданий', description: 'Выполните 100 заданий', icon: '✅✅✅', points: 200, category: 'progress' },
        { id: 'tasks_250', name: '250 заданий', description: 'Выполните 250 заданий', icon: '✅✅✅✅', points: 400, category: 'progress' },
        { id: 'tasks_500', name: '500 заданий', description: 'Выполните 500 заданий', icon: '✅✅✅✅✅', points: 800, category: 'progress' },
        
        // ========== НАВЫКИ (SKILLS) ==========
        { id: 'linux_master', name: 'Мастер Linux', description: 'Завершите все задания по Linux', icon: '🐧', points: 200, category: 'skills' },
        { id: 'python_master', name: 'Python эксперт', description: 'Завершите все задания по Python', icon: '🐍', points: 200, category: 'skills' },
        { id: 'network_master', name: 'Сетевой гуру', description: 'Завершите все задания по сетям', icon: '🌐', points: 200, category: 'skills' },
        { id: 'pentest_master', name: 'Мастер пентеста', description: 'Завершите все задания по пентестингу', icon: '🎯', points: 300, category: 'skills' },
        { id: 'blue_team_master', name: 'Blue Team эксперт', description: 'Завершите все задания по Blue Team', icon: '🛡️', points: 300, category: 'skills' },
        { id: 'wireshark_pro', name: 'Wireshark Pro', description: 'Освойте анализ трафика в Wireshark', icon: '📡', points: 150, category: 'skills' },
        { id: 'nmap_expert', name: 'Nmap эксперт', description: 'Освойте сканирование с Nmap', icon: '🔍', points: 150, category: 'skills' },
        { id: 'burp_master', name: 'Burp Suite мастер', description: 'Освойте Burp Suite для веб-тестирования', icon: '🕷️', points: 200, category: 'skills' },
        { id: 'metasploit_pro', name: 'Metasploit Pro', description: 'Освойте фреймворк Metasploit', icon: '💣', points: 250, category: 'skills' },
        { id: 'sql_injection', name: 'SQL Injection мастер', description: 'Освойте SQL инъекции', icon: '💉', points: 200, category: 'skills' },
        { id: 'xss_master', name: 'XSS мастер', description: 'Освойте XSS атаки', icon: '⚠️', points: 200, category: 'skills' },
        { id: 'crypto_expert', name: 'Криптограф', description: 'Освойте криптографию', icon: '🔐', points: 250, category: 'skills' },
        { id: 'reverse_engineer', name: 'Реверс-инженер', description: 'Освойте реверс-инжиниринг', icon: '🔬', points: 300, category: 'skills' },
        { id: 'malware_analyst', name: 'Аналитик вредоносного ПО', description: 'Освойте анализ malware', icon: '🦠', points: 300, category: 'skills' },
        { id: 'siem_expert', name: 'SIEM эксперт', description: 'Освойте работу с SIEM системами', icon: '📊', points: 250, category: 'skills' },
        { id: 'ad_master', name: 'Active Directory мастер', description: 'Освойте работу с Active Directory', icon: '🏢', points: 300, category: 'skills' },
        { id: 'bash_scripting', name: 'Bash скриптер', description: 'Освойте bash скриптование', icon: '💻', points: 150, category: 'skills' },
        { id: 'packet_tracer', name: 'Packet Tracer Pro', description: 'Освойте Cisco Packet Tracer', icon: '📦', points: 150, category: 'skills' },
        { id: 'tryhackme', name: 'TryHackMe герой', description: 'Завершите путь Pre-Security на TryHackMe', icon: '🎮', points: 200, category: 'skills' },
        { id: 'hackthebox', name: 'HackTheBox воин', description: 'Решите 5 машин на HackTheBox', icon: '📦', points: 300, category: 'skills' },
        
        // ========== АКТИВНОСТЬ (ACTIVITY) ==========
        { id: 'early_bird', name: 'Ранняя пташка', description: 'Занимайтесь в 6 утра', icon: '🌅', points: 50, category: 'activity' },
        { id: 'night_owl', name: 'Ночная сова', description: 'Занимайтесь поздно вечером', icon: '🦉', points: 30, category: 'activity' },
        { id: 'marathon', name: 'Марафонец', description: 'Занимайтесь более 4 часов в день', icon: '🏃', points: 100, category: 'activity' },
        { id: 'study_1h', name: 'Час обучения', description: 'Занимайтесь 1 час в день', icon: '⏰', points: 25, category: 'activity' },
        { id: 'study_2h', name: 'Два часа обучения', description: 'Занимайтесь 2 часа в день', icon: '⏰⏰', points: 50, category: 'activity' },
        { id: 'study_3h', name: 'Три часа обучения', description: 'Занимайтесь 3 часа в день', icon: '⏰⏰⏰', points: 75, category: 'activity' },
        { id: 'study_5h', name: 'Пять часов обучения', description: 'Занимайтесь 5 часов в день', icon: '⏰⏰⏰⏰⏰', points: 150, category: 'activity' },
        { id: 'total_10h', name: '10 часов всего', description: 'Накопите 10 часов обучения', icon: '📚', points: 50, category: 'activity' },
        { id: 'total_50h', name: '50 часов всего', description: 'Накопите 50 часов обучения', icon: '📚📚', points: 200, category: 'activity' },
        { id: 'total_100h', name: '100 часов всего', description: 'Накопите 100 часов обучения', icon: '📚📚📚', points: 400, category: 'activity' },
        { id: 'total_200h', name: '200 часов всего', description: 'Накопите 200 часов обучения', icon: '📚📚📚📚', points: 800, category: 'activity' },
        { id: 'weekend_warrior', name: 'Выходной воин', description: 'Занимайтесь в выходные дни', icon: '🎯', points: 40, category: 'activity' },
        { id: 'daily_grind', name: 'Ежедневный труд', description: 'Занимайтесь каждый день недели', icon: '💪', points: 100, category: 'activity' },
        
        // ========== СОЦИАЛЬНЫЕ (SOCIAL) ==========
        { id: 'blogger', name: 'Блогер', description: 'Напишите первую статью в блоге', icon: '✍️', points: 50, category: 'social' },
        { id: 'blogger_5', name: 'Активный блогер', description: 'Напишите 5 статей в блоге', icon: '✍️✍️', points: 150, category: 'social' },
        { id: 'blogger_10', name: 'Профессиональный блогер', description: 'Напишите 10 статей в блоге', icon: '✍️✍️✍️', points: 300, category: 'social' },
        { id: 'portfolio', name: 'Портфолио', description: 'Добавьте первый проект в портфолио', icon: '💼', points: 50, category: 'social' },
        { id: 'portfolio_3', name: 'Портфолио растет', description: 'Добавьте 3 проекта в портфолио', icon: '💼💼', points: 150, category: 'social' },
        { id: 'portfolio_5', name: 'Богатое портфолио', description: 'Добавьте 5 проектов в портфолио', icon: '💼💼💼', points: 300, category: 'social' },
        { id: 'github', name: 'GitHub профиль', description: 'Создайте GitHub профиль', icon: '🐙', points: 30, category: 'social' },
        { id: 'documentation', name: 'Документатор', description: 'Напишите документацию к проекту', icon: '📖', points: 75, category: 'social' },
        
        // ========== СПЕЦИАЛЬНЫЕ (SPECIAL) ==========
        { id: 'perfectionist', name: 'Перфекционист', description: 'Выполните все задания без пропусков', icon: '💎', points: 300, category: 'special' },
        { id: 'speed_learner', name: 'Скоростное обучение', description: 'Завершите месяц за 20 дней', icon: '⚡', points: 200, category: 'special' },
        { id: 'early_finisher', name: 'Ранний финишер', description: 'Завершите фазу раньше срока', icon: '🏁', points: 250, category: 'special' },
        { id: 'comeback', name: 'Возвращение', description: 'Вернитесь после перерыва', icon: '🔄', points: 50, category: 'special' },
        { id: 'dedication', name: 'Преданность', description: 'Занимайтесь 3 месяца подряд', icon: '❤️', points: 500, category: 'special' },
        { id: 'legend', name: 'Легенда', description: 'Достигните 50 уровня', icon: '🌟', points: 2000, category: 'special' },
        { id: 'master', name: 'Мастер', description: 'Достигните 30 уровня', icon: '🎖️', points: 1000, category: 'special' },
        { id: 'expert', name: 'Эксперт', description: 'Достигните 20 уровня', icon: '🏆', points: 500, category: 'special' },
        { id: 'veteran', name: 'Ветеран', description: 'Достигните 10 уровня', icon: '🎗️', points: 200, category: 'special' },
        { id: 'points_1000', name: '1000 очков', description: 'Накопите 1000 очков', icon: '💰', points: 100, category: 'special' },
        { id: 'points_5000', name: '5000 очков', description: 'Накопите 5000 очков', icon: '💰💰', points: 300, category: 'special' },
        { id: 'points_10000', name: '10000 очков', description: 'Накопите 10000 очков', icon: '💰💰💰', points: 600, category: 'special' },
        { id: 'points_25000', name: '25000 очков', description: 'Накопите 25000 очков', icon: '💰💰💰💰', points: 1500, category: 'special' },
        { id: 'points_50000', name: '50000 очков', description: 'Накопите 50000 очков', icon: '💰💰💰💰💰', points: 3000, category: 'special' },
        { id: 'all_daily', name: 'Все ежедневные', description: 'Выполните все ежедневные задания за день', icon: '⭐', points: 100, category: 'special' },
        { id: 'week_complete', name: 'Неделя без пропусков', description: 'Завершите неделю без пропусков', icon: '📅', points: 150, category: 'special' },
        { id: 'month_complete', name: 'Месяц без пропусков', description: 'Завершите месяц без пропусков', icon: '🗓️', points: 400, category: 'special' },
        { id: 'first_goal', name: 'Первая цель', description: 'Достигните первой цели', icon: '🎯', points: 50, category: 'special' },
        { id: 'goal_master', name: 'Мастер целей', description: 'Достигните 10 целей', icon: '🎯🎯', points: 300, category: 'special' },
        { id: 'cheatsheet_collector', name: 'Коллекционер шпаргалок', description: 'Используйте все шпаргалки', icon: '📚', points: 100, category: 'special' },
        { id: 'video_watcher', name: 'Любитель видео', description: 'Посмотрите 50 обучающих видео', icon: '📺', points: 150, category: 'special' },
        { id: 'roadmap_explorer', name: 'Исследователь плана', description: 'Просмотрите весь план обучения', icon: '🗺️', points: 50, category: 'special' }
    ],

    init: function() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                unlocked: [],
                points: 0,
                level: 1
            }));
        }
    },

    getData: function() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : { unlocked: [], points: 0, level: 1 };
    },

    saveData: function(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    checkAchievement: function(achievementId) {
        if (!achievementId) {
            console.warn('checkAchievement вызван без ID');
            return false;
        }
        
        const data = this.getData();
        if (!data.unlocked) {
            data.unlocked = [];
        }
        
        if (data.unlocked.includes(achievementId)) {
            return false; // Уже разблокировано
        }

        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) {
            console.warn(`Достижение с ID "${achievementId}" не найдено`);
            return false;
        }

        data.unlocked.push(achievementId);
        data.points = (data.points || 0) + achievement.points;
        data.level = this.calculateLevel(data.points);
        this.saveData(data);

        // Показываем уведомление
        this.showNotification(achievement);
        
        // Обновляем страницу достижений, если она открыта
        if (typeof loadAchievements === 'function') {
            setTimeout(() => {
                try {
                    loadAchievements();
                } catch (e) {
                    console.warn('Ошибка обновления страницы достижений:', e);
                }
            }, 500);
        }
        
        return true;
    },

    calculateLevel: function(points) {
        // Уровень = квадратный корень от очков / 10
        return Math.floor(Math.sqrt(points / 10)) + 1;
    },

    showNotification: function(achievement) {
        // Проверяем, что DOM готов
        if (!document.body) {
            setTimeout(() => this.showNotification(achievement), 100);
            return;
        }

        // Браузерное уведомление (если разрешено)
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification('🏆 Достижение разблокировано!', {
                    body: `${achievement.name}\n${achievement.description}\n+${achievement.points} очков`,
                    icon: '/assets/icons/icon-192x192.png',
                    tag: `achievement-${achievement.id}`,
                    requireInteraction: false
                });
            } catch (e) {
                console.warn('Ошибка браузерного уведомления:', e);
            }
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            // Запрашиваем разрешение при первом разблокировании
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification(achievement);
                }
            });
        }

        // In-app уведомление
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.setAttribute('data-achievement-id', achievement.id);
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <div class="achievement-icon-large">${achievement.icon || '🏆'}</div>
                <div>
                    <h4>🎉 Достижение разблокировано!</h4>
                    <p><strong>${achievement.name || 'Достижение'}</strong></p>
                    <p>${achievement.description || ''}</p>
                    <p class="points">+${achievement.points || 0} очков</p>
                </div>
                <button class="notification-close" onclick="this.closest('.achievement-notification').remove()" style="background: transparent; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer; padding: 0; margin-left: auto;">×</button>
            </div>
        `;
        
        // Удаляем предыдущие уведомления с тем же ID
        const existing = document.querySelector(`[data-achievement-id="${achievement.id}"]`);
        if (existing) {
            existing.remove();
        }
        
        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Звуковой эффект (опционально)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGW57+OcTQ8MT6Tg8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBhlue/jnE0PDE+k4PO2YxwGOJHX8sx5LAUkd8fw3ZBAC');
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Игнорируем ошибки
        } catch (e) {
            // Игнорируем ошибки звука
        }

        // Автоматическое удаление через 7 секунд
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 7000);
    },

    getUnlocked: function() {
        return this.getData().unlocked;
    },

    getPoints: function() {
        return this.getData().points;
    },

    getLevel: function() {
        return this.getData().level;
    },

    getProgressToNextLevel: function() {
        const currentLevel = this.getLevel();
        const currentPoints = this.getPoints();
        const pointsForCurrentLevel = Math.pow((currentLevel - 1) * 10, 2);
        const pointsForNextLevel = Math.pow(currentLevel * 10, 2);
        const progress = ((currentPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
        return Math.min(100, Math.max(0, progress));
    },

    getAllAchievements: function() {
        return this.achievements;
    },

    getAchievementsByCategory: function(category) {
        return this.achievements.filter(a => a.category === category);
    }
};

// Инициализация
AchievementsSystem.init();

