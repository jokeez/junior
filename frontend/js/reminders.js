// Напоминания о занятиях

const RemindersSystem = {
    STORAGE_KEY: 'cybersecurity_reminders',
    
    init: function() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ reminders: [] }));
        }
        this.startChecking();
    },
    
    getReminders: function() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data).reminders : [];
    },
    
    saveReminders: function(reminders) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ reminders }));
    },
    
    addReminder: function(reminder) {
        const reminders = this.getReminders();
        reminders.push({
            id: Date.now().toString(),
            time: reminder.time, // HH:MM
            message: reminder.message,
            days: reminder.days || [0,1,2,3,4,5,6], // 0=воскресенье
            enabled: true
        });
        this.saveReminders(reminders);
    },
    
    intervalId: null,
    
    startChecking: function() {
        // Останавливаем предыдущий интервал, если есть
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(() => this.checkReminders(), 60000); // Каждую минуту
    },
    
    checkReminders: function() {
        const reminders = this.getReminders().filter(r => r.enabled);
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const currentDay = now.getDay();
        
        reminders.forEach(reminder => {
            if (reminder.time === currentTime && reminder.days.includes(currentDay)) {
                this.showReminder(reminder);
            }
        });
    },
    
    showReminder: function(reminder) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⏰ Напоминание', {
                body: reminder.message,
                icon: '/assets/icons/icon-192x192.png',
                tag: `reminder-${reminder.id}`
            });
        }
        
        // In-app уведомление
        if (typeof SleepMode !== 'undefined' && SleepMode.showInAppNotification) {
            SleepMode.showInAppNotification('⏰ Напоминание', reminder.message);
        }
    }
};

RemindersSystem.init();

