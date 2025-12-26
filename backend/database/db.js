const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

const dbPath = path.resolve(__dirname, 'cybersecurity.db');
const dbDir = path.dirname(dbPath);

// Создаем директорию для БД, если её нет
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключение к SQLite базе данных установлено.');
    // Инициализируем схему
    initDatabase();
  }
});

function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  
  if (!fs.existsSync(schemaPath)) {
    console.error('Файл схемы не найден:', schemaPath);
    return;
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schema, (err) => {
    if (err) {
      console.error('Ошибка инициализации схемы БД:', err.message);
    } else {
      console.log('Схема базы данных инициализирована.');
    }
  });
}

module.exports = db;

