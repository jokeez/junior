// Геймификация: очки, уровни, ежедневные задания, стрики

const Gamification = {
    STORAGE_KEY: 'cybersecurity_gamification',
    
    init: function() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                points: 0,
                level: 1,
                streak: 0,
                lastActivityDate: null,
                dailyTasks: [],
                dailyTasksCompleted: {},
                totalStudyTime: 0, // в минутах
                sessionStartTime: null
            }));
        }
        this.checkStreak();
        this.loadDailyTasks();
    },

    getData: function() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : { points: 0, level: 1, streak: 0 };
    },

    saveData: function(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // Очки
    addPoints: function(amount, reason = '') {
        const data = this.getData();
        data.points = (data.points || 0) + amount;
        const oldLevel = data.level || 1;
        data.level = this.calculateLevel(data.points);
        
        this.saveData(data);
        
        // Проверка повышения уровня
        if (data.level > oldLevel) {
            this.onLevelUp(data.level);
        }
        
        // Проверка достижений по очкам
        if (typeof AchievementsSystem !== 'undefined') {
            const totalPoints = data.points;
            if (totalPoints >= 1000) AchievementsSystem.checkAchievement('points_1000');
            if (totalPoints >= 5000) AchievementsSystem.checkAchievement('points_5000');
            if (totalPoints >= 10000) AchievementsSystem.checkAchievement('points_10000');
            if (totalPoints >= 25000) AchievementsSystem.checkAchievement('points_25000');
            if (totalPoints >= 50000) AchievementsSystem.checkAchievement('points_50000');
        }
        
        return data.points;
    },

    getPoints: function() {
        return this.getData().points;
    },

    // Уровни
    calculateLevel: function(points) {
        // Формула: уровень = sqrt(очки / 100) + 1
        return Math.floor(Math.sqrt(points / 100)) + 1;
    },

    getLevel: function() {
        return this.getData().level;
    },

    getProgressToNextLevel: function() {
        const currentLevel = this.getLevel();
        const currentPoints = this.getPoints();
        const pointsForCurrentLevel = Math.pow((currentLevel - 1), 2) * 100;
        const pointsForNextLevel = Math.pow(currentLevel, 2) * 100;
        const progress = ((currentPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
        return Math.min(100, Math.max(0, progress));
    },

    onLevelUp: function(newLevel) {
        // Уведомление о повышении уровня
        if (!document.body) {
            setTimeout(() => this.onLevelUp(newLevel), 100);
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <div class="achievement-icon-large">🎉</div>
                <div>
                    <h4>Уровень повышен!</h4>
                    <p><strong>Теперь вы уровень ${newLevel}</strong></p>
                    <p>Продолжайте в том же духе!</p>
                </div>
                <button class="notification-close" onclick="this.closest('.achievement-notification').remove()">×</button>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);

        // Разблокировка достижения за уровни
        if (typeof AchievementsSystem !== 'undefined') {
            if (newLevel >= 10) AchievementsSystem.checkAchievement('veteran');
            if (newLevel >= 20) AchievementsSystem.checkAchievement('expert');
            if (newLevel >= 30) AchievementsSystem.checkAchievement('master');
            if (newLevel >= 50) AchievementsSystem.checkAchievement('legend');
        }
    },

    // Стрики
    checkStreak: function() {
        const data = this.getData();
        const today = new Date().toDateString();
        const lastDate = data.lastActivityDate ? new Date(data.lastActivityDate).toDateString() : null;
        
        if (!lastDate) {
            // Первая активность
            data.streak = 1;
            data.lastActivityDate = new Date().toISOString();
            this.saveData(data);
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastDate === today) {
            // Уже активен сегодня
            return;
        } else if (lastDate === yesterdayStr) {
            // Продолжаем стрик
            data.streak += 1;
            data.lastActivityDate = new Date().toISOString();
            this.saveData(data);
            
            // Награда за стрик
            this.addPoints(10 * data.streak, `Стрик ${data.streak} дней`);
            
            // Проверка достижений стрика
            this.checkStreakAchievements(data.streak);
            
            // Проверка других достижений стрика
            if (typeof AchievementsSystem !== 'undefined') {
                if (data.streak === 5) AchievementsSystem.checkAchievement('streak_5');
                if (data.streak === 14) AchievementsSystem.checkAchievement('streak_14');
                if (data.streak === 21) AchievementsSystem.checkAchievement('streak_21');
                if (data.streak === 60) AchievementsSystem.checkAchievement('streak_60');
                if (data.streak === 100) AchievementsSystem.checkAchievement('streak_100');
            }
        } else {
            // Стрик прерван
            data.streak = 1;
            data.lastActivityDate = new Date().toISOString();
            this.saveData(data);
        }
    },

    getStreak: function() {
        return this.getData().streak;
    },

    checkStreakAchievements: function(streak) {
        if (typeof AchievementsSystem !== 'undefined') {
            if (streak === 3) AchievementsSystem.checkAchievement('streak_3');
            if (streak === 7) AchievementsSystem.checkAchievement('streak_7');
            if (streak === 30) AchievementsSystem.checkAchievement('streak_30');
        }
    },

    // Ежедневные задания
    dailyTasks: [
        { id: 'complete_task', name: 'Выполнить задание', description: 'Выполните любое задание из плана', points: 20, icon: '✅' },
        { id: 'study_30min', name: '30 минут обучения', description: 'Занимайтесь 30 минут', points: 15, icon: '⏰' },
        { id: 'complete_day', name: 'Завершить день', description: 'Завершите полный день обучения', points: 50, icon: '📅' },
        { id: 'write_blog', name: 'Написать заметку', description: 'Напишите статью в блоге', points: 30, icon: '✍️' },
        { id: 'early_bird', name: 'Ранняя пташка', description: 'Начните обучение до 8 утра', points: 25, icon: '🌅' }
    ],

    loadDailyTasks: function() {
        const data = this.getData();
        const today = new Date().toDateString();
        const lastTasksDate = data.dailyTasksDate || null;

        if (lastTasksDate !== today) {
            // Новый день - сброс заданий
            data.dailyTasks = this.dailyTasks.map(t => ({ ...t }));
            data.dailyTasksCompleted = {};
            data.dailyTasksDate = today;
            this.saveData(data);
            
            // Проверка достижения "первый день"
            if (typeof AchievementsSystem !== 'undefined' && !lastTasksDate) {
                AchievementsSystem.checkAchievement('first_day');
            }
        }
    },

    getDailyTasks: function() {
        const data = this.getData();
        return data.dailyTasks || [];
    },

    completeDailyTask: function(taskId) {
        const data = this.getData();
        if (data.dailyTasksCompleted[taskId]) {
            return false; // Уже выполнено
        }

        const task = data.dailyTasks.find(t => t.id === taskId);
        if (!task) return false;

        data.dailyTasksCompleted[taskId] = true;
        this.addPoints(task.points, `Ежедневное задание: ${task.name}`);
        this.saveData(data);

        // Проверка всех заданий
        this.checkAllDailyTasksCompleted();
        
        return true;
    },

    checkAllDailyTasksCompleted: function() {
        const data = this.getData();
        const tasks = data.dailyTasks || [];
        const completed = data.dailyTasksCompleted || {};
        const allCompleted = tasks.length > 0 && tasks.every(t => completed[t.id]);
        
        if (allCompleted && typeof AchievementsSystem !== 'undefined') {
            // Бонус за выполнение всех заданий (только один раз в день)
            const bonusKey = `daily_bonus_${new Date().toDateString()}`;
            if (!localStorage.getItem(bonusKey)) {
                this.addPoints(100, 'Все ежедневные задания выполнены!');
                AchievementsSystem.checkAchievement('all_daily');
                localStorage.setItem(bonusKey, 'true');
            }
        }
    },
    
    checkStreakAchievements: function(streak) {
        if (typeof AchievementsSystem === 'undefined') return;
        
        // Проверка всех достижений стрика
        if (streak >= 3) AchievementsSystem.checkAchievement('streak_3');
        if (streak >= 5) AchievementsSystem.checkAchievement('streak_5');
        if (streak >= 7) AchievementsSystem.checkAchievement('streak_7');
        if (streak >= 14) AchievementsSystem.checkAchievement('streak_14');
        if (streak >= 21) AchievementsSystem.checkAchievement('streak_21');
        if (streak >= 30) AchievementsSystem.checkAchievement('streak_30');
        if (streak >= 60) AchievementsSystem.checkAchievement('streak_60');
        if (streak >= 100) AchievementsSystem.checkAchievement('streak_100');
    },

    // Отслеживание времени
    startSession: function() {
        const data = this.getData();
        data.sessionStartTime = new Date().toISOString();
        this.saveData(data);
    },

    endSession: function() {
        const data = this.getData();
        if (!data.sessionStartTime) return 0;

        const start = new Date(data.sessionStartTime);
        const end = new Date();
        const minutes = Math.max(0, Math.floor((end - start) / (1000 * 60)));
        
        if (!data.totalStudyTime) {
            data.totalStudyTime = 0;
        }
        
        data.totalStudyTime += minutes;
        data.sessionStartTime = null;
        this.saveData(data);

        // Награда за время (только если сессия была достаточно длинной)
        if (minutes >= 30) {
            this.completeDailyTask('study_30min');
        }
        
        // Проверка достижений по времени обучения
        if (typeof AchievementsSystem !== 'undefined') {
            const totalTime = data.totalStudyTime;
            if (totalTime >= 10 * 60) AchievementsSystem.checkAchievement('total_10h');
            if (totalTime >= 50 * 60) AchievementsSystem.checkAchievement('total_50h');
            if (totalTime >= 100 * 60) AchievementsSystem.checkAchievement('total_100h');
            if (totalTime >= 200 * 60) AchievementsSystem.checkAchievement('total_200h');
            
            if (minutes >= 60) AchievementsSystem.checkAchievement('study_1h');
            if (minutes >= 120) AchievementsSystem.checkAchievement('study_2h');
            if (minutes >= 180) AchievementsSystem.checkAchievement('study_3h');
            if (minutes >= 300) AchievementsSystem.checkAchievement('study_5h');
            if (minutes >= 240) AchievementsSystem.checkAchievement('marathon');
        }

        return minutes;
    },

    getTotalStudyTime: function() {
        const data = this.getData();
        return data.totalStudyTime || 0;
    },

    getTodayStudyTime: function() {
        const data = this.getData();
        if (!data.sessionStartTime) {
            // Возвращаем время из сегодняшних сессий (можно улучшить)
            return 0;
        }

        const start = new Date(data.sessionStartTime);
        const now = new Date();
        const minutes = Math.max(0, Math.floor((now - start) / (1000 * 60)));
        
        // Ограничиваем максимальное время сессии (защита от ошибок)
        return Math.min(minutes, 1440); // Максимум 24 часа
    }
};

// Инициализация
Gamification.init();

// Автоматический старт сессии при загрузке страницы (только на страницах, где это нужно)
// Удалено глобальное добавление, чтобы не запускать на всех страницах

