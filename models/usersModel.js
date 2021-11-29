const connection = require('./connection');

const findAll = async () => (connection.connect()
  .then((db) => db.collection('users').find().toArray()));

const create = async ({ email, password, name, role }) => {
  const user = await connection.connect()
    .then((db) => db.collection('users').findOne({ email }));
  if (user) return null;
  return connection.connect().then((db) => db.collection('users').insertOne({
    email,
    password,
    name,
    role,
  })).then((result) => ({ name, email, role, _id: result.insertedId }));
};

module.exports = {
  findAll,
  create,
};