const connection = require('./connection');

module.exports = async (email) => (connection.connect()
  .then((db) => db.collection('users').findOne({ email })));