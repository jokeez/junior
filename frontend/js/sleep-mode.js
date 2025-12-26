// Режим сна и уведомления о перерывах

const SleepMode = {
    STORAGE_KEY: 'cybersecurity_sleep_mode',
    WAKE_UP_HOUR: 6, // 6 утра
    BREAK_INTERVAL: 90, // Перерывы каждые 90 минут
    BREAK_DURATION: 15, // Перерыв 15 минут
    timerUpdateInterval: null,
    
    init: function() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                enabled: true,
                wakeUpTime: '06:00',
                breakReminders: true,
                lastBreakTime: null,
                sleepTime: '22:00',
                breakInterval: 90,
                breakDuration: 15
            }));
        }
        this.startMonitoring();
        this.startTimerUpdates();
    },

    getData: function() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) {
            return { enabled: true, wakeUpTime: '06:00', breakReminders: true, breakInterval: 90, breakDuration: 15 };
        }
        const parsed = JSON.parse(data);
        // Убеждаемся, что новые поля существуют
        if (!parsed.breakInterval) parsed.breakInterval = 90;
        if (!parsed.breakDuration) parsed.breakDuration = 15;
        return parsed;
    },

    saveData: function(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    startMonitoring: function() {
        // Проверка времени каждую минуту
        setInterval(() => {
            this.checkWakeUpTime();
            this.checkBreakTime();
        }, 60000); // Каждую минуту

        // Проверка при загрузке
        this.checkWakeUpTime();
        this.checkBreakTime();
    },

    checkWakeUpTime: function() {
        const data = this.getData();
        if (!data.enabled) return;

        const now = new Date();
        const [hours, minutes] = data.wakeUpTime.split(':').map(Number);
        const wakeUpTime = new Date();
        wakeUpTime.setHours(hours, minutes, 0, 0);

        // Если уже прошло время подъема сегодня
        if (now.getHours() >= hours && now.getMinutes() >= minutes) {
            // Проверяем, не показывали ли уже сегодня
            const lastNotification = localStorage.getItem('last_wakeup_notification');
            const today = now.toDateString();
            
            if (lastNotification !== today) {
                this.showWakeUpNotification();
                localStorage.setItem('last_wakeup_notification', today);
            }
        }
    },

    checkBreakTime: function() {
        const data = this.getData();
        if (data.breakReminders === false) return; // Проверяем только breakReminders, не enabled

        const now = new Date();
        const lastBreak = data.lastBreakTime ? new Date(data.lastBreakTime) : null;
        const breakInterval = this.getBreakInterval();
        const breakDuration = this.getBreakDuration();

        if (!lastBreak) {
            // Первый перерыв через заданный интервал после начала работы
            data.lastBreakTime = now.toISOString();
            this.saveData(data);
            return;
        }

        const timeSinceBreak = (now - lastBreak) / (1000 * 60); // в минутах

        if (timeSinceBreak >= breakInterval) {
            // Проверяем, не показывали ли уже уведомление в последние 5 минут
            const lastBreakNotification = localStorage.getItem('last_break_notification');
            const fiveMinutesAgo = now.getTime() - (5 * 60 * 1000);
            
            if (!lastBreakNotification || parseInt(lastBreakNotification) < fiveMinutesAgo) {
                this.showBreakNotification(breakInterval, breakDuration);
                data.lastBreakTime = now.toISOString();
                this.saveData(data);
                localStorage.setItem('last_break_notification', now.getTime().toString());
            }
        }
    },

    showWakeUpNotification: function() {
        if (!('Notification' in window)) {
            console.log('Браузер не поддерживает уведомления');
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification('🌅 Время подъема!', {
                body: 'Доброе утро! Пора начинать обучение. Вставайте в 6 утра каждый день!',
                icon: '/assets/icons/icon-192x192.png',
                tag: 'wakeup',
                requireInteraction: true
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showWakeUpNotification();
                }
            });
        }

        // In-app уведомление
        this.showInAppNotification('🌅 Время подъема!', 'Доброе утро! Пора начинать обучение.');
    },

    showBreakNotification: function(interval, duration) {
        interval = interval || this.BREAK_INTERVAL;
        duration = duration || this.BREAK_DURATION;
        
        if (!('Notification' in window)) return;

        if (Notification.permission === 'granted') {
            new Notification('⏸️ Время перерыва!', {
                body: `Вы занимались ${interval} минут. Сделайте перерыв на ${duration} минут, чтобы не перегореть!`,
                icon: '/assets/icons/icon-192x192.png',
                tag: 'break',
                requireInteraction: true
            });
        }

        // In-app уведомление
        this.showInAppNotification(
            '⏸️ Время перерыва!',
            `Вы занимались ${interval} минут. Сделайте перерыв на ${duration} минут!`,
            'break'
        );
    },

    showInAppNotification: function(title, message, type = 'info') {
        if (!document.body) {
            // Документ еще не загружен
            setTimeout(() => this.showInAppNotification(title, message, type), 100);
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `in-app-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${type === 'break' ? '⏸️' : '🌅'}</div>
                <div>
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Добавляем в контейнер уведомлений или в body
        let container = document.getElementById('notificationsContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationsContainer';
            container.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 2000; max-width: 400px;';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);

        // Автоматическое удаление через 10 секунд
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 10000);
    },

    requestNotificationPermission: function() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    },

    setWakeUpTime: function(time) {
        const data = this.getData();
        data.wakeUpTime = time;
        this.saveData(data);
        this.updateTimerDisplay();
    },

    setSleepTime: function(time) {
        const data = this.getData();
        data.sleepTime = time;
        this.saveData(data);
    },

    toggleBreakReminders: function(enabled) {
        const data = this.getData();
        data.breakReminders = enabled;
        this.saveData(data);
    },

    enable: function() {
        const data = this.getData();
        data.enabled = true;
        this.saveData(data);
        this.requestNotificationPermission();
    },

    disable: function() {
        const data = this.getData();
        data.enabled = false;
        this.saveData(data);
        this.updateTimerDisplay();
    },
    
    // Обновление таймера в шапке
    startTimerUpdates: function() {
        // Обновляем каждую секунду
        this.timerUpdateInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
        this.updateTimerDisplay(); // Первое обновление сразу
    },
    
    updateTimerDisplay: function() {
        const container = document.getElementById('navTimerContainer');
        const timerText = document.getElementById('timerText');
        
        if (!container || !timerText) return;
        
        const data = this.getData();
        
        // Если режим сна выключен и перерывы выключены - скрываем таймер
        if (!data.enabled && !data.breakReminders) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'flex';
        
        let timeUntil = null;
        let label = '';
        
        // Проверяем время до следующего перерыва
        if (data.breakReminders) {
            const now = new Date();
            const lastBreak = data.lastBreakTime ? new Date(data.lastBreakTime) : null;
            const breakInterval = (data.breakInterval || this.BREAK_INTERVAL) * 60 * 1000; // в миллисекундах
            
            if (lastBreak) {
                const nextBreakTime = new Date(lastBreak.getTime() + breakInterval);
                const timeDiff = nextBreakTime - now;
                
                if (timeDiff > 0) {
                    timeUntil = timeDiff;
                    label = 'До перерыва';
                } else {
                    // Время перерыва уже наступило
                    timeUntil = 0;
                    label = 'Время перерыва!';
                }
            } else {
                // Еще не было перерыва, показываем полный интервал
                timeUntil = breakInterval;
                label = 'До перерыва';
            }
        }
        
        // Проверяем время до будильника
        if (data.enabled && data.wakeUpTime) {
            const now = new Date();
            const [hours, minutes] = data.wakeUpTime.split(':').map(Number);
            const wakeUp = new Date();
            wakeUp.setHours(hours, minutes, 0, 0);
            
            // Если время подъема уже прошло сегодня, показываем на завтра
            if (wakeUp <= now) {
                wakeUp.setDate(wakeUp.getDate() + 1);
            }
            
            const timeToWakeUp = wakeUp - now;
            
            // Показываем либо время до перерыва, либо до будильника (что ближе)
            if (!timeUntil || timeToWakeUp < timeUntil) {
                timeUntil = timeToWakeUp;
                label = 'До подъема';
            }
        }
        
        if (timeUntil !== null && timeUntil >= 0) {
            const totalSeconds = Math.floor(timeUntil / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            if (timeUntil <= 0 || totalSeconds <= 0) {
                timerText.textContent = 'Сейчас!';
                if (timerText.parentElement) {
                    timerText.parentElement.classList.add('timer-active');
                }
            } else if (hours > 0) {
                timerText.textContent = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                if (timerText.parentElement) {
                    timerText.parentElement.classList.remove('timer-active');
                }
            } else {
                timerText.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
                if (timerText.parentElement) {
                    timerText.parentElement.classList.remove('timer-active');
                }
            }
            
            // Добавляем подсказку
            timerText.setAttribute('title', label);
        } else {
            container.style.display = 'none';
        }
    },
    
    setBreakInterval: function(minutes) {
        const data = this.getData();
        data.breakInterval = Math.max(30, Math.min(180, minutes)); // Ограничение 30-180
        this.saveData(data);
        this.updateTimerDisplay();
    },
    
    setBreakDuration: function(minutes) {
        const data = this.getData();
        data.breakDuration = Math.max(5, Math.min(60, minutes)); // Ограничение 5-60
        this.saveData(data);
    },
    
    // Получить интервал перерыва
    getBreakInterval: function() {
        const data = this.getData();
        return data.breakInterval || this.BREAK_INTERVAL;
    },
    
    // Получить длительность перерыва
    getBreakDuration: function() {
        const data = this.getData();
        return data.breakDuration || this.BREAK_DURATION;
    }
};

// Инициализация при загрузке
SleepMode.init();

// Запрос разрешения на уведомления при первом визите
if ('Notification' in window && Notification.permission === 'default') {
    // Можно показать кнопку для запроса разрешения
    document.addEventListener('DOMContentLoaded', () => {
        // Автоматически запрашиваем при загрузке страницы
        setTimeout(() => SleepMode.requestNotificationPermission(), 2000);
    });
}

