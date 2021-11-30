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

const getConnection = async () => {
  const URLMock = await DBServer.getUri();
  const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  return MongoClient.connect(URLMock, OPTIONS);
};

describe('Testa create de users', () => {
  describe('Quando as entradas são inválidas', () => {
    let response = {};
    let createdUser = {};

    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));

      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);
      response = await chai.request(server)
        .post('/users')
        .send({
          email: 'erickjaquin@gmail.com',
          password: '12345678',
        });

      createdUser = await connectionMock.collection('users')
        .findOne({ email: 'erickjaquin@gmail.com' });
    });

    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Não cria usuário no banco', async () => {
      expect(createdUser).to.be.null;
    });

    it('Retorna a mensagem de erro correta', () => {
      expect(response).to.have.status(400);
      expect(response.body).to.be.deep.equal({ message: 'Invalid entries. Try again.' });
    });
  });

  describe('Quando o usuário já existe', () => {
    let response = {};
    let users = {};

    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('jwt_exercise'));

      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      await connectionMock.collection('users').insertOne(
        {
          email: 'erickjaquin@gmail.com',
          password: '12345678',
          name: 'Erick Jacquin',
        }
      );

      response = await chai.request(server)
        .post('/users')
        .send({
          email: 'erickjaquin@gmail.com',
          password: '12345678',
          name: 'Erick Jacquin',
        });

      users = await connectionMock.collection('users').find().toArray();
    });

    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Não cria usuário no banco', async () => {
      expect(users.length).to.be.equal(1);
    });

    it('Retorna a mensagem de erro correta', () => {
      expect(response).to.have.status(409);
      expect(response.body).to.be.deep.equal({ message: 'Email already registered' });
    });
  });

  describe('Quando cadastra com sucesso', () => {
    let response = {};
    let createdUser = {};

    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('jwt_exercise'));

      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      response = await chai.request(server)
        .post('/users')
        .send({
          email: 'erickjaquin@gmail.com',
          password: '12345678',
          name: 'Erick Jacquin',
        });
      
      createdUser = await connectionMock.collection('users').findOne({ name: 'Erick Jacquin' });
    });

    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Cria usuário no banco', async () => {
      expect(createdUser).to.be.not.null;
    });

    it('Retorna a resposta correta', () => {
      expect(response).to.have.status(201);
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('email');
      expect(response.body.user.email).to.be.equal('erickjaquin@gmail.com');
      expect(response.body.user).to.have.property('role');
      expect(response.body.user.role).to.be.equal('user');
      expect(response.body.user).to.have.property('name');
      expect(response.body.user.name).to.be.equal('Erick Jacquin');
      expect(response.body.user).to.have.property('_id');
    });
  });
});