const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { ObjectId } = require('mongodb');
const server = require('../src/api/app');
const mongoConnection = require('../src/api/models/connection');

chai.use(chaiHttp);

const { expect } = chai;

const DBServer = new MongoMemoryServer();

const CHICKEN_ID = '61a5be249f88de5e287012ef';
const ADMIN_ID = '61a5cdb52c6416a8ec4c18a2';
const ERICK_ID = '61a5cdb52c6416a8ec4c18a3';

const getConnection = async () => {
  const URLMock = await DBServer.getUri();
  const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  return MongoClient.connect(URLMock, OPTIONS);
};

describe('Testa remove de recipes', () => {
  const users = [
    { _id: ADMIN_ID, name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' },
    { _id: ERICK_ID,
      name: 'Erick Jacquin', email: 'erickjaquin@gmail.com', password: '12345678', role: 'user' }
  ];

  const recipe = {
    _id: ObjectId(CHICKEN_ID),
    name: 'Receita de frango do Jacquin',
    ingredients: 'Frango',
    preparation: '10 min no forno',
    userId: ADMIN_ID,
  };

  describe('Quando não está autenticado', () => {
    let response = {};
  
    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));
  
      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      response = await chai.request(server).delete(`/recipes/${CHICKEN_ID}`);
    });
  
    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Retorna a mensagem de erro correta', () => {
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ message: 'missing auth token' });
    });
  });

  describe('Quando não está autorizado', () => {
    let response = {};
    let recipeData = {};
  
    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));
  
      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      await connectionMock.collection('users').insertMany(users);
      await connectionMock.collection('recipes').insertOne(recipe);

      const token = await chai.request(server).post('/login')
        .send({
          email: 'erickjaquin@gmail.com',
          password: '12345678',
        }).then((res) => res.body.token);

      response = await chai.request(server).delete(`/recipes/${CHICKEN_ID}`).set('authorization', token);
      recipeData = await connectionMock.collection('recipes')
        .findOne({ name: 'Receita de frango do Jacquin' });
    });
  
    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Não deleta receita no banco', async () => {
      expect(recipeData).to.be.not.null;
    });
  
    it('Retorna a mensagem de erro correta', () => {
      expect(response).to.have.status(403);
      expect(response.body).to.be.deep.equal({ message: 'unauthorized action' });
    });
  });

  describe('Quando não está autorizado', () => {
    let response = {};
    let recipeData = {};
  
    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));
  
      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      await connectionMock.collection('users').insertMany(users);
      await connectionMock.collection('recipes').insertOne(recipe);

      const token = await chai.request(server).post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        }).then((res) => res.body.token);

      response = await chai.request(server).delete(`/recipes/${CHICKEN_ID}`).set('authorization', token);
      recipeData = await connectionMock.collection('recipes')
        .findOne({ name: 'Receita de frango do Jacquin' });
    });
  
    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Deleta receita no banco', async () => {
      expect(recipeData).to.be.null;
    });
  
    it('Retorna a resposta correta', () => {
      expect(response).to.have.status(204);
      expect(response.body).to.be.deep.equal({});
    });
  });
});
