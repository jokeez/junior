# Инструкция по загрузке на GitHub

## Быстрая загрузка через PowerShell

После создания нового репозитория на GitHub выполните следующие команды:

```powershell
# 1. Инициализация Git (если еще не сделано)
git init

# 2. Добавление всех файлов
git add .

# 3. Первый коммит
git commit -m "Initial commit: Cybersecurity Learning Platform"

# 4. Переименование ветки в main
git branch -M main

# 5. Добавление удаленного репозитория (ЗАМЕНИТЕ YOUR_REPO_NAME на имя вашего репозитория)
git remote add origin https://github.com/jokeez/YOUR_REPO_NAME.git

# 6. Отправка на GitHub
git push -u origin main
```

## Настройка GitHub Pages

1. Откройте репозиторий на GitHub
2. Перейдите в **Settings** → **Pages**
3. В разделе **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/frontend` (или `/(root)` если используете корневой index.html)
4. Нажмите **Save**

## Через несколько минут

Сайт будет доступен по адресу:
```
https://jokeez.github.io/YOUR_REPO_NAME/
```

## Важно

- На GitHub Pages API (бэкенд) не работает, поэтому блог и портфолио используют localStorage
- Для полной функциональности с API запустите локально: `npm start`
- Файл `.nojekyll` в папке `frontend/` отключает обработку Jekyll для правильной работы


