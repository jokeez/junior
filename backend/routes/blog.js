const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// Получить все статьи
router.get('/', (req, res) => {
  BlogPost.getAll((err, posts) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(posts);
  });
});

// Получить статью по ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  BlogPost.getById(id, (err, post) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!post) {
      return res.status(404).json({ error: 'Статья не найдена' });
    }
    res.json(post);
  });
});

// Создать новую статью
router.post('/', (req, res) => {
  const { title, content, markdown_content, tags, category } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Заголовок и содержимое обязательны' });
  }

  BlogPost.create({ title, content, markdown_content, tags, category }, (err, post) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(post);
  });
});

// Обновить статью
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, markdown_content, tags, category } = req.body;

  BlogPost.update(id, { title, content, markdown_content, tags, category }, (err, post) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(post);
  });
});

// Удалить статью
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  BlogPost.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Статья удалена', ...result });
  });
});

// Поиск статей
router.get('/search/:query', (req, res) => {
  const { query } = req.params;
  BlogPost.search(query, (err, posts) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(posts);
  });
});

module.exports = router;

