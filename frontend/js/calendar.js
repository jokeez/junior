// Календарь обучения

let roadmapData = null;
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Загрузка roadmap
async function loadRoadmapForCalendar() {
    try {
        // Определяем базовый путь в зависимости от структуры URL
        const basePath = window.location.pathname.includes('/pages/') 
            ? '../data/roadmap.json'  // Если мы в pages/, идем на уровень выше
            : 'data/roadmap.json';    // Если в корне frontend/
        
        // Пробуем разные пути для локальной разработки и GitHub Pages
        const paths = [
            basePath,
            'data/roadmap.json',
            '/data/roadmap.json',
            './data/roadmap.json',
            '../data/roadmap.json',
            window.location.origin + '/data/roadmap.json'
        ];
        
        let response = null;
        
        for (const path of paths) {
            try {
                response = await fetch(path);
                if (response.ok) {
                    break;
                }
            } catch (e) {
                continue;
            }
        }
        
        if (!response || !response.ok) {
            throw new Error('Файл roadmap.json не найден');
        }
        
        roadmapData = await response.json();
        renderCalendar();
    } catch (error) {
        console.error('Ошибка загрузки плана:', error);
    }
}

// Рендеринг календаря
function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    if (!container) return;
    
    const monthYear = document.getElementById('currentMonthYear');
    
    if (monthYear) {
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                           'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }

    // Вычисление дат для плана обучения
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = startDate.getDay();
    const daysInMonth = endDate.getDate();
    const today = new Date();

    // Создание карты дней обучения
    const learningDaysMap = createLearningDaysMap();

    let html = '<div class="calendar-grid">';
    
    // Дни недели
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    weekDays.forEach(day => {
        html += `<div class="calendar-day-header" style="font-weight: 600; text-align: center; padding: 0.5rem;">${day}</div>`;
    });

    // Пустые ячейки до первого дня месяца
    for (let i = 0; i < (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1); i++) {
        html += '<div class="calendar-day"></div>';
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = date.toISOString().split('T')[0];
        const isToday = date.toDateString() === today.toDateString();
        const dayInfo = learningDaysMap[dateStr];
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (dayInfo) {
            if (dayInfo.completed) classes += ' completed';
            else if (dayInfo.inProgress) classes += ' in-progress';
            else classes += ' planned';
        }

        html += `
            <div class="${classes}" onclick="showDayDetails('${dateStr}')">
                <div style="font-weight: 600;">${day}</div>
                ${dayInfo ? `<div style="font-size: 0.75rem; margin-top: 0.25rem;">${dayInfo.title}</div>` : ''}
            </div>
        `;
    }

    html += '</div>';
    container.innerHTML = html;
}

// Создание карты дней обучения
function createLearningDaysMap() {
    if (!roadmapData) return {};
    
    const map = {};
    let currentDay = 0;
    const startDate = new Date(); // Можно настроить дату начала обучения
    
    roadmapData.phases.forEach(phase => {
        phase.months.forEach(month => {
            month.weeks.forEach(week => {
                week.days.forEach(day => {
                    const date = new Date(startDate);
                    date.setDate(date.getDate() + currentDay);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    // Проверка выполнения
                    const completed = ProgressTracker.isTaskCompleted(day.id);
                    const tasks = day.tasks || [];
                    const completedTasks = tasks.filter(t => ProgressTracker.isTaskCompleted(t.id)).length;
                    const inProgress = completedTasks > 0 && completedTasks < tasks.length;
                    
                    map[dateStr] = {
                        title: day.title,
                        completed: completed,
                        inProgress: inProgress,
                        day: day
                    };
                    
                    currentDay++;
                });
            });
        });
    });
    
    return map;
}

// Показать детали дня
function showDayDetails(dateStr) {
    if (!roadmapData) return;
    
    // Находим день в roadmap
    let dayInfo = null;
    roadmapData.phases.forEach(phase => {
        phase.months.forEach(month => {
            month.weeks.forEach(week => {
                week.days.forEach(day => {
                    // Можно добавить проверку по дате
                });
            });
        });
    });
    
    if (dayInfo) {
        // Можно открыть модальное окно с деталями
        alert(`День: ${dateStr}\n${dayInfo.title || 'Информация о дне'}`);
    }
}

// Предыдущий месяц
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

// Следующий месяц
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadRoadmapForCalendar();
});

