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

describe('Testa createAdmin de users', () => {
  describe('Quando não está autenticado', () => {
    let response = {};

    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));

      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      response = await chai.request(server)
        .post('/users/admin')
        .send({
          email: 'erickjaquin@gmail.com',
          password: '12345678',
          name: 'Erick Jacquin',
        });
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

  describe('Quando a autenticação é inválida', () => {
    let response = {};

    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));

      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      const users = [
        { name: 'user', email: 'root@email.com', password: 'user', role: 'user' }
      ];

      await connectionMock.collection('users').insertMany(users);

      const token = await chai.request(server).post('/login')
        .send({
          email: 'root@email.com',
          password: 'user',
        }).then((res) => res.body.token);

      response = await chai.request(server)
        .post('/users/admin')
        .send({
          email: 'erickjaquin@gmail.com',
          password: '12345678',
          name: 'Erick Jacquin',
        }).set('authorization', token);
    });

    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
    });

    it('Retorna a mensagem de erro correta', () => {
      expect(response).to.have.status(403);
      expect(response.body).to.be.deep.equal({ message: 'Only admins can register new admins' });
    });
  });

  describe('Quando as entradas são inválidas', () => {
    let response = {};
    let createdUser = {};

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

      response = await chai.request(server)
        .post('/users/admin')
        .send({
          email: 'erickjaquin@gmail.com',
          password: '12345678',
        }).set('authorization', token);

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

    before(async () => {
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));

      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      const users = [
        { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' },
        { name: 'Erick Jacquin', email: 'erickjaquin@gmail.com', password: '12345678', role: 'user' }
      ];

      await connectionMock.collection('users').insertMany(users);

      const token = await chai.request(server).post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        }).then((res) => res.body.token);

      response = await chai.request(server)
        .post('/users/admin')
        .send({
          email: 'erickjaquin@gmail.com',
          password: '12345678',
          name: 'Erick Jacquin',
        }).set('authorization', token);
    });

    after(async () => {
      mongoConnection.connect.restore();
      await DBServer.stop();
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
      const connectionMock = await getConnection().then((conn) => conn.db('Cookmaster'));

      sinon.stub(mongoConnection, 'connect').resolves(connectionMock);

      const user = { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' };

      await connectionMock.collection('users').insertOne(user);

      const token = await chai.request(server).post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        }).then((res) => res.body.token);

      response = await chai.request(server)
        .post('/users/admin')
        .send({
          email: 'erickjaquin@gmail.com',
          password: '12345678',
          name: 'Erick Jacquin',
        }).set('authorization', token);
      
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
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('email');
      expect(response.body.user.email).to.be.equal('erickjaquin@gmail.com');
      expect(response.body.user).to.have.property('role');
      expect(response.body.user.role).to.be.equal('admin');
      expect(response.body.user).to.have.property('name');
      expect(response.body.user.name).to.be.equal('Erick Jacquin');
      expect(response.body.user).to.have.property('_id');
    });
  });
});
