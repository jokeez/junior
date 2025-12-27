module.exports = {
  port: process.env.PORT || 3000,
  dbPath: './backend/database/cybersecurity.db',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
};


