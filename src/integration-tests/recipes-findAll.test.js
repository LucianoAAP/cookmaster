const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../api/app');
const mongoConnection = require('../api/models/connection');

chai.use(chaiHttp);

const { expect } = chai;

const DBServer = new MongoMemoryServer();

const BANANA_ID = '61a5be249f88de5e287012ef';

const getConnection = async () => {
  const URLMock = await DBServer.getUri();
  const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  return MongoClient.connect(URLMock, OPTIONS);
};

describe('Testa findAll de recipes', () => {
  let response = {};
  const recipe = {
    _id: BANANA_ID,
    name: 'banana caramelizada',
    ingredients: 'banana, açúcar',
    preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
  };

  before(async () => {
    const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));

    sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

    await connectionMock.collection('recipes').insertOne(recipe);

    response = await chai.request(server)
      .get('/recipes');
  });

  after(async () => {
    mongoConnection.connect.restore();
    await DBServer.stop();
  });

  it('Retorna uma lista de receitas', () => {
    expect(response).to.have.status(200);
    expect(response.body).to.be.deep.equal([{ _id: BANANA_ID, ...recipe }]);
  });
});
