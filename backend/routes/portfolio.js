const express = require('express');
const router = express.Router();
const PortfolioItem = require('../models/PortfolioItem');

// Получить все проекты
router.get('/', (req, res) => {
  PortfolioItem.getAll((err, items) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(items);
  });
});

// Получить проект по ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  PortfolioItem.getById(id, (err, item) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!item) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    res.json(item);
  });
});

// Создать новый проект
router.post('/', (req, res) => {
  const { title, description, github_url, demo_url, image_url, technologies, category } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Название проекта обязательно' });
  }

  PortfolioItem.create({ title, description, github_url, demo_url, image_url, technologies, category }, (err, item) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(item);
  });
});

// Обновить проект
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, github_url, demo_url, image_url, technologies, category } = req.body;

  PortfolioItem.update(id, { title, description, github_url, demo_url, image_url, technologies, category }, (err, item) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(item);
  });
});

// Удалить проект
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  PortfolioItem.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Проект удален', ...result });
  });
});

// Получить проекты по категории
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  PortfolioItem.getByCategory(category, (err, items) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(items);
  });
});

module.exports = router;



