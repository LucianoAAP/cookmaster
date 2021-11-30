const { ObjectId } = require('mongodb');
const connection = require('./connection');

const findAll = async () => (connection.connect()
  .then((db) => db.collection('recipes').find().toArray()));

const findById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const recipe = await connection.connect()
    .then((db) => db.collection('recipes').findOne(ObjectId(id)));
  if (!recipe) return null;
  return { _id: id, ...recipe };
};

const create = async ({ name, ingredients, preparation, userId }) => (connection.connect()
  .then((db) => db.collection('recipes').insertOne({
      name,
      ingredients,
      preparation,
      userId,
    })).then((result) => ({ name, ingredients, preparation, _id: result.insertedId })));

const update = async (id, entries) => {
  await connection.connect().then((db) => db.collection('recipes').updateOne(
    { _id: ObjectId(id) },
    { $set: { ...entries } },
  ));
  return findById(id);
};

const remove = async (id) => {
  const recipe = await findById(id);
  await connection.connect()
    .then((db) => db.collection('recipes').deleteOne({ _id: ObjectId(id) }));
  return recipe;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};