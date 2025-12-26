// Отслеживание прогресса (localStorage)

const ProgressTracker = {
    STORAGE_KEY: 'cybersecurity_progress',

    // Инициализация
    init: function() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                completedTasks: {},
                completedDays: {},
                startDate: new Date().toISOString()
            }));
        }
    },

    // Получить все данные прогресса
    getProgress: function() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : { completedTasks: {}, completedDays: {} };
    },

    // Сохранить прогресс
    saveProgress: function(progress) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    },

    // Отметить задание как выполненное
    completeTask: function(taskId) {
        const progress = this.getProgress();
        const now = new Date().toISOString();
        progress.completedTasks[taskId] = {
            completed: true,
            timestamp: now,
            date: now.split('T')[0]
        };
        this.saveProgress(progress);
        
        // Добавление очков и проверка достижений
        if (typeof Gamification !== 'undefined') {
            Gamification.addPoints(10, 'Выполнение задания');
            Gamification.completeDailyTask('complete_task');
        }
        
        if (typeof AchievementsSystem !== 'undefined') {
            // Проверка первого задания
            const completedCount = Object.keys(progress.completedTasks).length;
            if (completedCount === 1) {
                AchievementsSystem.checkAchievement('first_task');
            }
        }
        
        return true;
    },

    // Отметить задание как невыполненное
    uncompleteTask: function(taskId) {
        const progress = this.getProgress();
        delete progress.completedTasks[taskId];
        this.saveProgress(progress);
        return true;
    },

    // Проверить, выполнено ли задание
    isTaskCompleted: function(taskId) {
        const progress = this.getProgress();
        const task = progress.completedTasks[taskId];
        if (typeof task === 'object' && task !== null) {
            return task.completed === true;
        }
        return task === true;
    },
    
    // Получить временную метку выполнения задания
    getTaskTimestamp: function(taskId) {
        const progress = this.getProgress();
        const task = progress.completedTasks[taskId];
        if (typeof task === 'object' && task !== null) {
            return task.timestamp;
        }
        return null;
    },
    
    // Получить статистику по времени
    getTimeStats: function() {
        const progress = this.getProgress();
        const tasks = progress.completedTasks;
        const stats = {
            totalTasks: Object.keys(tasks).length,
            tasksByDate: {},
            tasksByHour: {},
            averageTimePerTask: 0
        };
        
        let totalMinutes = 0;
        Object.keys(tasks).forEach(taskId => {
            const task = tasks[taskId];
            if (typeof task === 'object' && task.timestamp) {
                const date = new Date(task.timestamp);
                const dateStr = date.toDateString();
                const hour = date.getHours();
                
                stats.tasksByDate[dateStr] = (stats.tasksByDate[dateStr] || 0) + 1;
                stats.tasksByHour[hour] = (stats.tasksByHour[hour] || 0) + 1;
                
                // Примерная оценка времени (можно улучшить)
                totalMinutes += 30; // Предполагаем 30 минут на задание
            }
        });
        
        stats.averageTimePerTask = stats.totalTasks > 0 ? totalMinutes / stats.totalTasks : 0;
        stats.totalStudyTime = totalMinutes;
        
        return stats;
    },

    // Отметить день как выполненный
    completeDay: function(dayId) {
        const progress = this.getProgress();
        progress.completedDays[dayId] = true;
        this.saveProgress(progress);
        return true;
    },

    // Получить статистику
    getStats: function() {
        const progress = this.getProgress();
        const completedTasks = Object.keys(progress.completedTasks || {}).length;
        const completedDays = Object.keys(progress.completedDays || {}).length;
        
        // Подсчет общего количества заданий (синхронно, если возможно)
        // Для точного подсчета нужно загрузить roadmap, но это асинхронно
        // Поэтому используем приблизительную оценку или кэшированное значение
        const cachedTotal = localStorage.getItem('total_tasks_count');
        const totalTasks = cachedTotal ? parseInt(cachedTotal) : 0;
        
        const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Проверка достижений прогресса
        if (typeof AchievementsSystem !== 'undefined') {
            this.checkProgressAchievements(progressPercent, completedTasks);
        }

        return {
            completedTasks,
            totalTasks: totalTasks || 1000, // Временное значение, если не загружено
            progressPercent,
            completedDays
        };
    },
    
    // Проверка достижений прогресса
    checkProgressAchievements: function(progressPercent, completedTasks) {
        if (typeof AchievementsSystem === 'undefined') return;
        
        // Проверка процентов прогресса
        if (progressPercent >= 10) AchievementsSystem.checkAchievement('progress_10');
        if (progressPercent >= 25) AchievementsSystem.checkAchievement('progress_25');
        if (progressPercent >= 50) AchievementsSystem.checkAchievement('progress_50');
        if (progressPercent >= 75) AchievementsSystem.checkAchievement('progress_75');
        if (progressPercent >= 90) AchievementsSystem.checkAchievement('progress_90');
        if (progressPercent >= 100) AchievementsSystem.checkAchievement('progress_100');
        
        // Проверка количества заданий
        if (completedTasks >= 10) AchievementsSystem.checkAchievement('tasks_10');
        if (completedTasks >= 50) AchievementsSystem.checkAchievement('tasks_50');
        if (completedTasks >= 100) AchievementsSystem.checkAchievement('tasks_100');
        if (completedTasks >= 250) AchievementsSystem.checkAchievement('tasks_250');
        if (completedTasks >= 500) AchievementsSystem.checkAchievement('tasks_500');
    },

    // Экспорт прогресса
    exportProgress: function() {
        const progress = this.getProgress();
        const dataStr = JSON.stringify(progress, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `progress_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    // Импорт прогресса
    importProgress: function(jsonData) {
        try {
            const progress = JSON.parse(jsonData);
            if (progress.completedTasks && progress.completedDays) {
                this.saveProgress(progress);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Ошибка импорта:', e);
            return false;
        }
    }
};

// Инициализация при загрузке
ProgressTracker.init();

