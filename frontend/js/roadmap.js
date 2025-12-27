// Загрузка и отображение плана обучения

let roadmapData = null;

// Загрузка roadmap.json
async function loadRoadmap() {
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
        let lastError = null;
        
        for (const path of paths) {
            try {
                response = await fetch(path);
                if (response.ok) {
                    break;
                }
            } catch (e) {
                lastError = e;
                continue;
            }
        }
        
        if (!response || !response.ok) {
            throw new Error('Файл roadmap.json не найден по путям: ' + paths.join(', '));
        }
        
        roadmapData = await response.json();
        renderRoadmap();
    } catch (error) {
        console.error('Ошибка загрузки плана:', error);
        console.error('Текущий путь:', window.location.pathname);
        const container = document.getElementById('roadmapContainer');
        if (container) {
            container.innerHTML = 
                '<p style="color: red; padding: 2rem; text-align: center;">Ошибка загрузки плана обучения. Проверьте наличие файла data/roadmap.json<br><small>Путь: ' + window.location.pathname + '</small></p>';
        }
    }
}

// Рендеринг плана
function renderRoadmap() {
    try {
        if (!roadmapData) {
            console.error('roadmapData is null');
            return;
        }

        const container = document.getElementById('roadmapContainer');
        if (!container) {
            console.error('roadmapContainer element not found');
            return;
        }
        
        let html = '';
        let dayCount = 0;

        roadmapData.phases.forEach((phase, phaseIndex) => {
            console.log(`Рендеринг фазы ${phaseIndex + 1}: ${phase.name}`);
            
            html += `
            <div class="phase-section" data-phase="${phase.id}">
                <div class="phase-header">
                    <h2>${phase.name}</h2>
                    <p>Длительность: ${phase.duration} дней</p>
                </div>
        `;

            phase.months.forEach((month, monthIndex) => {
                console.log(`  Рендеринг месяца ${monthIndex + 1}: ${month.name}`);
            html += `
                <div class="month-section">
                    <div class="month-header">
                        <h3>${month.name}</h3>
                    </div>
            `;

                month.weeks.forEach((week, weekIndex) => {
                    console.log(`    Рендеринг недели ${weekIndex + 1}: ${week.name}, дней: ${week.days ? week.days.length : 0}`);
                    
                    html += `
                    <div class="week-section">
                        <div class="week-header">
                            <h4>${week.name}</h4>
                        </div>
                `;

                    if (week.days) {
                        week.days.forEach((day, dayIndex) => {
                            try {
                                dayCount++;
                                if (dayCount % 20 === 0 || dayCount === 88 || dayCount === 89 || dayCount === 90 || dayCount === 111 || dayCount === 112 || dayCount === 113) {
                                    console.log(`      День ${dayCount}: ${day.id || dayIndex}, range: ${day.dayRange}`);
                                }
                                
                                const dayId = day.id;
                                const isCompleted = ProgressTracker.isTaskCompleted(dayId);
                                
                                // Экранируем кавычки в строках для безопасности
                                const safeTitle = (day.title || '').replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                                const safeDescription = (day.description || '').replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                                const safeYoutubeVideo = day.youtubeVideo ? day.youtubeVideo.replace(/'/g, "&#39;").replace(/"/g, "&quot;") : '';
                                const safeWhatToUnderstand = day.whatToUnderstand ? day.whatToUnderstand.replace(/'/g, "&#39;").replace(/"/g, "&quot;") : '';
                                const safeWhatToDo = day.whatToDo ? day.whatToDo.replace(/'/g, "&#39;").replace(/"/g, "&quot;") : '';
                                
                                html += `
                        <div class="day-item" data-day="${dayId}">
                            <div class="day-header">
                                <span class="day-title">День ${day.dayRange}: ${safeTitle}</span>
                                <span class="day-type ${day.type}">${day.type === 'theory' ? 'Теория' : 'Практика'}</span>
                            </div>
                            <div class="day-content">
                                <p><strong>Описание:</strong> ${safeDescription}</p>
                                ${day.youtubeVideo ? `
                                    <div class="youtube-video">
                                        <i class="fab fa-youtube"></i>
                                        <strong>Видео:</strong> ${safeYoutubeVideo}
                                        <div style="margin-top: 1rem;">
                                            <button class="btn btn-secondary" onclick="searchYouTubeVideo('${safeYoutubeVideo}', '${dayId}')">
                                                <i class="fab fa-youtube"></i> Найти видео на YouTube
                                            </button>
                                            <div id="youtube-embed-${dayId}" style="margin-top: 1rem;"></div>
                                        </div>
                                    </div>
                                ` : ''}
                                ${day.whatToUnderstand ? `<p><strong>Что понять:</strong> ${safeWhatToUnderstand}</p>` : ''}
                                ${day.whatToDo ? `<p><strong>Что сделать:</strong> ${safeWhatToDo}</p>` : ''}
                            </div>
                            ${day.tasks && day.tasks.length > 0 ? `
                                <div class="tasks-list">
                                    ${day.tasks.map(task => {
                                        const taskCompleted = ProgressTracker.isTaskCompleted(task.id);
                                        const safeTaskText = (task.text || '').replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                                        return `
                                            <div class="task-item ${taskCompleted ? 'completed' : ''}">
                                                <input type="checkbox" 
                                                       id="${task.id}" 
                                                       ${taskCompleted ? 'checked' : ''}
                                                       onchange="toggleTask('${task.id}')">
                                                <label for="${task.id}">${safeTaskText}</label>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `;
                            } catch (dayError) {
                                console.error(`Ошибка рендеринга дня ${dayCount} (${day.id || dayIndex}):`, dayError);
                                html += `<div class="day-item error"><p>Ошибка отображения дня ${day.id || dayIndex}</p></div>`;
                            }
                        });
                    } else {
                        console.warn(`      Неделя ${weekIndex + 1} не имеет дней!`);
                    }

                    html += `</div>`; // week-section
                });

                // Финальный проект месяца
                if (month.finalProject) {
                    html += `
                    <div class="day-item final-project">
                        <div class="day-header">
                            <span class="day-title">Финальный проект: ${month.finalProject.title}</span>
                            <span class="day-type practice">Проект</span>
                        </div>
                        <div class="day-content">
                            <p><strong>Описание:</strong> ${month.finalProject.description}</p>
                            ${month.finalProject.youtubeVideo ? `
                                <div class="youtube-video">
                                    <i class="fab fa-youtube"></i>
                                    <strong>Видео:</strong> ${month.finalProject.youtubeVideo}
                                </div>
                            ` : ''}
                            ${month.finalProject.tasks && month.finalProject.tasks.length > 0 ? `
                                <div class="tasks-list">
                                    ${month.finalProject.tasks.map(task => {
                                        const taskCompleted = ProgressTracker.isTaskCompleted(task.id);
                                        return `
                                            <div class="task-item ${taskCompleted ? 'completed' : ''}">
                                                <input type="checkbox" 
                                                       id="${task.id}" 
                                                       ${taskCompleted ? 'checked' : ''}
                                                       onchange="toggleTask('${task.id}')">
                                                <label for="${task.id}">${task.text}</label>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
                }

                html += `</div>`; // month-section
            });

            html += `</div>`; // phase-section
        });

        container.innerHTML = html;
        
        console.log('Roadmap rendered successfully. Total days rendered:', dayCount, 'Expected:', roadmapData.totalDays);
        
        // Сохраняем общее количество заданий для статистики
        let totalTasksCount = 0;
        roadmapData.phases.forEach(phase => {
            phase.months.forEach(month => {
                month.weeks.forEach(week => {
                    week.days.forEach(day => {
                        if (day.tasks) totalTasksCount += day.tasks.length;
                    });
                });
                if (month.finalProject && month.finalProject.tasks) {
                    totalTasksCount += month.finalProject.tasks.length;
                }
            });
        });
        localStorage.setItem('total_tasks_count', totalTasksCount.toString());
    } catch (error) {
        console.error('Ошибка рендеринга плана обучения:', error);
        console.error('Stack trace:', error.stack);
        const container = document.getElementById('roadmapContainer');
        if (container) {
            container.innerHTML = '<p style="color: red; padding: 2rem; text-align: center;">Ошибка отображения плана обучения. Проверьте консоль браузера для деталей.</p>';
        }
    }
}

// Поиск и встраивание YouTube видео
function searchYouTubeVideo(query, dayId) {
    // Проверка достижения "первый просмотр"
    if (typeof AchievementsSystem !== 'undefined') {
        const firstVideoKey = 'first_video_watched';
        if (!localStorage.getItem(firstVideoKey)) {
            AchievementsSystem.checkAchievement('first_video');
            localStorage.setItem(firstVideoKey, 'true');
        }
    }
    
    // Создаем поисковую ссылку на YouTube
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const embedContainer = document.getElementById(`youtube-embed-${dayId}`);
    
    if (!embedContainer) return;
    
    // Можно использовать YouTube Data API для поиска, но для простоты используем поисковую ссылку
    embedContainer.innerHTML = `
        <p style="margin-bottom: 0.5rem;">Нажмите на ссылку для поиска видео:</p>
        <a href="${searchUrl}" target="_blank" class="btn btn-primary">
            <i class="fab fa-youtube"></i> Открыть поиск на YouTube
        </a>
        <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-secondary);">
            Примечание: Для встраивания видео нужен ID видео с YouTube. 
            После поиска скопируйте ID из URL (например, dQw4w9WgXcQ) и вставьте ниже:
        </p>
        <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
            <input type="text" id="video-id-${dayId}" placeholder="ID видео (например: dQw4w9WgXcQ)" 
                   style="flex: 1; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
            <button class="btn btn-primary" onclick="embedYouTubeVideo('${dayId}')">
                Встроить видео
            </button>
        </div>
    `;
}

// Встраивание YouTube видео по ID
function embedYouTubeVideo(dayId) {
    const videoIdInput = document.getElementById(`video-id-${dayId}`);
    if (!videoIdInput) {
        alert('Поле ввода не найдено');
        return;
    }
    
    const videoId = videoIdInput.value.trim();
    if (!videoId) {
        alert('Введите ID видео');
        return;
    }
    
    const embedContainer = document.getElementById(`youtube-embed-${dayId}`);
    if (!embedContainer) {
        alert('Контейнер для видео не найден');
        return;
    }
    
    embedContainer.innerHTML = `
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
            <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                    src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        </div>
    `;
}

// Переключение статуса задания
function toggleTask(taskId) {
    const checkbox = document.getElementById(taskId);
    if (!checkbox) return;
    
    if (checkbox.checked) {
        ProgressTracker.completeTask(taskId);
    } else {
        ProgressTracker.uncompleteTask(taskId);
    }
    
    // Обновление визуального состояния
    const taskItem = checkbox.closest('.task-item');
    if (taskItem) {
        if (checkbox.checked) {
            taskItem.classList.add('completed');
        } else {
            taskItem.classList.remove('completed');
        }
    }
}

// Фильтрация по фазе
document.addEventListener('DOMContentLoaded', () => {
    const phaseFilter = document.getElementById('phaseFilter');
    if (phaseFilter) {
        phaseFilter.addEventListener('change', (e) => {
            const selectedPhase = e.target.value;
            const phaseSections = document.querySelectorAll('.phase-section');
            
            phaseSections.forEach(section => {
                if (selectedPhase === 'all' || section.dataset.phase === selectedPhase) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    }

    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce((e) => {
            const query = e.target.value.toLowerCase();
            const dayItems = document.querySelectorAll('.day-item');
            
            dayItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }, 300));
    }

    loadRoadmap();
});

