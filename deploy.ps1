# Скрипт для загрузки проекта на GitHub
# Использование: .\deploy.ps1 -RepoName "имя_репозитория"

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

Write-Host "🚀 Начинаем загрузку проекта на GitHub..." -ForegroundColor Green

# Проверка Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git не установлен! Установите Git с https://git-scm.com/downloads" -ForegroundColor Red
    exit 1
}

# Инициализация Git (если еще не сделано)
if (-not (Test-Path .git)) {
    Write-Host "📦 Инициализация Git репозитория..." -ForegroundColor Yellow
    git init
}

# Добавление всех файлов
Write-Host "📝 Добавление файлов..." -ForegroundColor Yellow
git add .

# Коммит
Write-Host "💾 Создание коммита..." -ForegroundColor Yellow
git commit -m "Initial commit: Cybersecurity Learning Platform - готов к работе на GitHub Pages"

# Переименование ветки
Write-Host "🌿 Настройка ветки main..." -ForegroundColor Yellow
git branch -M main

# Удаление старого remote (если есть)
if (git remote get-url origin -ErrorAction SilentlyContinue) {
    Write-Host "🔄 Удаление старого remote..." -ForegroundColor Yellow
    git remote remove origin
}

# Добавление нового remote
$repoUrl = "https://github.com/jokeez/$RepoName.git"
Write-Host "🔗 Добавление remote: $repoUrl" -ForegroundColor Yellow
git remote add origin $repoUrl

# Отправка на GitHub
Write-Host "⬆️  Отправка на GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  При запросе авторизации используйте Personal Access Token вместо пароля!" -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Проект успешно загружен на GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Следующие шаги:" -ForegroundColor Cyan
    Write-Host "1. Откройте: https://github.com/jokeez/$RepoName/settings/pages" -ForegroundColor White
    Write-Host "2. В разделе 'Build and deployment' выберите:" -ForegroundColor White
    Write-Host "   - Branch: main" -ForegroundColor White
    Write-Host "   - Folder: /frontend" -ForegroundColor White
    Write-Host "3. Нажмите Save" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Через 1-2 минуты сайт будет доступен по адресу:" -ForegroundColor Cyan
    Write-Host "   https://jokeez.github.io/$RepoName/" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Ошибка при отправке. Проверьте:" -ForegroundColor Red
    Write-Host "   - Репозиторий создан на GitHub" -ForegroundColor White
    Write-Host "   - Правильное имя репозитория: $RepoName" -ForegroundColor White
    Write-Host "   - Авторизация (используйте Personal Access Token)" -ForegroundColor White
}



