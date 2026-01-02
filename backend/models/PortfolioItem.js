const db = require('../database/db');

class PortfolioItem {
  static getAll(callback) {
    const query = 'SELECT * FROM portfolio_items ORDER BY created_at DESC';
    db.all(query, [], callback);
  }

  static getById(id, callback) {
    const query = 'SELECT * FROM portfolio_items WHERE id = ?';
    db.get(query, [id], callback);
  }

  static create(data, callback) {
    const { title, description, github_url, demo_url, image_url, technologies, category } = data;
    const query = `
      INSERT INTO portfolio_items (title, description, github_url, demo_url, image_url, technologies, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [title, description, github_url, demo_url, image_url, technologies, category], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: this.lastID, ...data });
      }
    });
  }

  static update(id, data, callback) {
    const { title, description, github_url, demo_url, image_url, technologies, category } = data;
    const query = `
      UPDATE portfolio_items 
      SET title = ?, description = ?, github_url = ?, demo_url = ?, image_url = ?, 
          technologies = ?, category = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    db.run(query, [title, description, github_url, demo_url, image_url, technologies, category, id], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id, ...data });
      }
    });
  }

  static delete(id, callback) {
    const query = 'DELETE FROM portfolio_items WHERE id = ?';
    db.run(query, [id], function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }

  static getByCategory(category, callback) {
    const query = 'SELECT * FROM portfolio_items WHERE category = ? ORDER BY created_at DESC';
    db.all(query, [category], callback);
  }
}

module.exports = PortfolioItem;





