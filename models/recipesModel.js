const connection = require('./connection');

const findAll = async () => (connection.connect()
  .then((db) => db.collection('recipes').find().toArray()));

const create = async ({ name, ingredients, preparation, userId }) => (connection.connect()
  .then((db) => db.collection('recipes').insertOne({
      name,
      ingredients,
      preparation,
      userId,
    })).then((result) => ({ name, ingredients, preparation, _id: result.insertedId })));

module.exports = {
  findAll,
  create,
};