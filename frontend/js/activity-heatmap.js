// График активности (heatmap) как на GitHub

const ActivityHeatmap = {
    getActivityData: function() {
        const progress = ProgressTracker.getProgress();
        const tasks = progress.completedTasks || {};
        const activity = {};
        
        Object.keys(tasks).forEach(taskId => {
            const task = tasks[taskId];
            let dateStr;
            if (typeof task === 'object' && task.timestamp) {
                dateStr = task.timestamp.split('T')[0];
            } else {
                dateStr = new Date().toISOString().split('T')[0];
            }
            activity[dateStr] = (activity[dateStr] || 0) + 1;
        });
        
        return activity;
    },
    
    generateHeatmap: function(containerId, weeks = 53) {
        if (typeof ProgressTracker === 'undefined') {
            console.error('ProgressTracker не загружен');
            return;
        }
        
        const activity = this.getActivityData();
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn('Контейнер для heatmap не найден:', containerId);
            return;
        }
        
        const today = new Date();
        const heatmap = [];
        
        // Генерируем данные за последние N недель
        for (let i = weeks * 7 - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = activity[dateStr] || 0;
            
            heatmap.push({
                date: dateStr,
                count: count,
                day: date.getDay(),
                week: Math.floor(i / 7)
            });
        }
        
        // Группируем по неделям
        const weeksData = {};
        heatmap.forEach(item => {
            if (!weeksData[item.week]) {
                weeksData[item.week] = [];
            }
            weeksData[item.week][item.day] = item;
        });
        
        // Рендеринг
        let html = '<div class="heatmap-container">';
        html += '<div class="heatmap-legend">';
        html += '<span>Меньше</span>';
        for (let i = 0; i < 5; i++) {
            html += `<div class="heatmap-legend-item" style="background: ${this.getColor(i)}"></div>`;
        }
        html += '<span>Больше</span>';
        html += '</div>';
        html += '<div class="heatmap-grid">';
        
        // Сортируем недели по убыванию
        const sortedWeeks = Object.keys(weeksData).map(Number).sort((a, b) => b - a);
        
        sortedWeeks.forEach(week => {
            html += '<div class="heatmap-week">';
            for (let day = 0; day < 7; day++) {
                const item = weeksData[week] && weeksData[week][day];
                if (item) {
                    const intensity = Math.min(4, Math.floor(item.count / 2));
                    const escapedDate = item.date.replace(/"/g, '&quot;');
                    html += `<div class="heatmap-day" style="background: ${this.getColor(intensity)}" title="${escapedDate}: ${item.count} заданий"></div>`;
                } else {
                    html += '<div class="heatmap-day empty"></div>';
                }
            }
            html += '</div>';
        });
        
        html += '</div></div>';
        container.innerHTML = html;
    },
    
    getColor: function(intensity) {
        const colors = [
            'rgba(30, 41, 59, 0.3)',      // 0
            'rgba(16, 185, 129, 0.4)',    // 1
            'rgba(16, 185, 129, 0.6)',    // 2
            'rgba(16, 185, 129, 0.8)',    // 3
            'rgba(16, 185, 129, 1)'       // 4
        ];
        return colors[intensity] || colors[0];
    }
};

