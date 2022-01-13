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

describe('Testa login', () => {
  describe('Quando as entradas são inválidas', () => {
    let response = {};
  
    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));
  
      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);
      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'erickjaquin@gmail.com',
        });
    });
  
    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });
  
    it('Retorna a mensagem de erro correta', () => {
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ message: 'All fields must be filled' });
    });
  });

  describe('Quando o usuário não existe', () => {
    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));
  
      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);
      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'erickjaquin@gmail.com',
          password: '12345678',
        });
    });
  
    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Retorna a mensagem de erro correta', () => {
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ message: 'Incorrect username or password' });
    });
  });

  describe('Quando a senha está incorreta', () => {
    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));
  
      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      const user = { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' };

      await connectionMock.collection('users').insertOne(user);

      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'xablau',
        });
    });
  
    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Retorna a mensagem de erro correta', () => {
      expect(response).to.have.status(401);
      expect(response.body).to.be.deep.equal({ message: 'Incorrect username or password' });
    });
  });

  describe('Quando é logado com sucesso', () => {
    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));
  
      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      const user = { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' };

      await connectionMock.collection('users').insertOne(user);

      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        });
    });
  
    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Retorna a resposta correta', () => {
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('token');
    });
  })
});
