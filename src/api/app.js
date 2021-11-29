const express = require('express');
const errorMiddleware = require('../../middlewares/error');

const app = express();
app.use(express.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/users', require('../../routers/usersRouter'));

app.use('/login', require('../../routers/loginRouter'));

app.use('/recipes', require('../../routers/recipesRouter'));

app.use(errorMiddleware);

module.exports = app;
