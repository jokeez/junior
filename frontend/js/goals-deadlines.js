// Система целей и дедлайнов

const GoalsSystem = {
    STORAGE_KEY: 'cybersecurity_goals',
    
    init: function() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ goals: [] }));
        }
    },
    
    getGoals: function() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data).goals : [];
    },
    
    saveGoals: function(goals) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ goals }));
    },
    
    addGoal: function(goal) {
        const goals = this.getGoals();
        goals.push({
            id: Date.now().toString(),
            title: goal.title,
            description: goal.description,
            deadline: goal.deadline,
            target: goal.target, // количество заданий/дней
            current: 0,
            completed: false,
            createdAt: new Date().toISOString()
        });
        this.saveGoals(goals);
    },
    
    updateGoal: function(id, updates) {
        const goals = this.getGoals();
        const index = goals.findIndex(g => g.id === id);
        if (index !== -1) {
            goals[index] = { ...goals[index], ...updates };
            this.saveGoals(goals);
        }
    },
    
    deleteGoal: function(id) {
        const goals = this.getGoals().filter(g => g.id !== id);
        this.saveGoals(goals);
    },
    
    checkDeadlines: function() {
        const goals = this.getGoals();
        const today = new Date();
        goals.forEach(goal => {
            if (!goal.completed && goal.deadline) {
                const deadline = new Date(goal.deadline);
                if (deadline < today) {
                    // Дедлайн прошел
                    this.showDeadlineNotification(goal);
                }
            }
        });
    },
    
    showDeadlineNotification: function(goal) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⏰ Дедлайн прошел', {
                body: `Цель "${goal.title}" просрочена`,
                icon: '/assets/icons/icon-192x192.png'
            });
        }
    }
};

GoalsSystem.init();

