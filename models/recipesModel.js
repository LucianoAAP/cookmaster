const connection = require('./connection');

const create = async ({ name, ingredients, preparation, userId }) => (connection.connect()
  .then((db) => db.collection('recipe').insertOne({
      name,
      ingredients,
      preparation,
      userId,
    })).then((result) => ({ name, ingredients, preparation, _id: result.insertedId })));

module.exports = {
  create,
};