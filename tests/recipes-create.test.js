const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../src/api/app');
const mongoConnection = require('../src/api/models/connection');

chai.use(chaiHttp);

const { expect } = chai;

const DBServer = new MongoMemoryServer();

const getConnection = async () => {
  const URLMock = await DBServer.getUri();
  const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  return MongoClient.connect(URLMock, OPTIONS);
};

describe('Testa create de recipes', () => {
  describe('Quando não está autenticado', () => {
    let response = {};
  
    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));
  
      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      response = await chai.request(server).post('/recipes');
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

  describe('Quando as entradas são inválidas', () => {
    let response = {};
    let createdRecipe = {};
  
    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));
  
      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      const user = { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' };

      await connectionMock.collection('users').insertOne(user);

      const token = await chai.request(server).post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        }).then((res) => res.body.token);

      response = await chai.request(server).post('/recipes')
        .send({
          name: 'banana caramelizada',
          ingredients: 'banana, açúcar',
        }).set('authorization', token);

      createdRecipe = await connectionMock.collection('recipes').findOne({ name: 'banana caramelizada' });
    });
  
    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Não cria receita no banco', async () => {
      expect(createdRecipe).to.be.null;
    });
  
    it('Retorna a mensagem de erro correta', () => {
      expect(response).to.have.status(400);
      expect(response.body).to.be.deep.equal({ message: 'Invalid entries. Try again.' });
    });
  });
  
  describe('Quando é criada com sucesso', () => {
    let response = {};
    let createdRecipe = {};
  
    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));
  
      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      const user = { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' };

      await connectionMock.collection('users').insertOne(user);

      const token = await chai.request(server).post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        }).then((res) => res.body.token);

      response = await chai.request(server).post('/recipes')
        .send({
          name: 'banana caramelizada',
          ingredients: 'banana, açúcar',
          preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
        }).set('authorization', token);

      createdRecipe = await connectionMock.collection('recipes').findOne({ name: 'banana caramelizada' });
    });
  
    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Cria receita no banco', async () => {
      expect(createdRecipe).to.be.not.null;
    });
  
    it('Retorna a resposta correta', () => {
      expect(response).to.have.status(201);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('recipe');
      expect(response.body.recipe).to.have.property('name');
      expect(response.body.recipe.name).to.be.equal('banana caramelizada');
      expect(response.body.recipe).to.have.property('ingredients');
      expect(response.body.recipe.ingredients).to.be.equal('banana, açúcar');
      expect(response.body.recipe).to.have.property('preparation');
      expect(response.body.recipe.preparation)
        .to.be.equal('coloque o açúcar na frigideira até virar caramelo e jogue a banana');
      expect(response.body.recipe).to.have.property('_id');
      expect(response.body.recipe).to.have.property('userId');
    });
  });
});