const db = require('../database/db');

class BlogPost {
  static getAll(callback) {
    const query = 'SELECT * FROM blog_posts ORDER BY created_at DESC';
    db.all(query, [], callback);
  }

  static getById(id, callback) {
    const query = 'SELECT * FROM blog_posts WHERE id = ?';
    db.get(query, [id], callback);
  }

  static create(data, callback) {
    const { title, content, markdown_content, tags, category } = data;
    const query = `
      INSERT INTO blog_posts (title, content, markdown_content, tags, category)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [title, content, markdown_content || content, tags, category], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: this.lastID, ...data });
      }
    });
  }

  static update(id, data, callback) {
    const { title, content, markdown_content, tags, category } = data;
    const query = `
      UPDATE blog_posts 
      SET title = ?, content = ?, markdown_content = ?, tags = ?, category = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    db.run(query, [title, content, markdown_content || content, tags, category, id], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id, ...data });
      }
    });
  }

  static delete(id, callback) {
    const query = 'DELETE FROM blog_posts WHERE id = ?';
    db.run(query, [id], function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }

  static search(query, callback) {
    const searchQuery = `
      SELECT * FROM blog_posts 
      WHERE title LIKE ? OR content LIKE ? OR tags LIKE ?
      ORDER BY created_at DESC
    `;
    const searchTerm = `%${query}%`;
    db.all(searchQuery, [searchTerm, searchTerm, searchTerm], callback);
  }
}

module.exports = BlogPost;





