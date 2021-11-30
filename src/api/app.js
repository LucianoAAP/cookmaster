const express = require('express');
const path = require('path');
const errorMiddleware = require('./middlewares/error');

const app = express();
app.use(express.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/users', require('./routers/usersRouter'));

app.use('/login', require('./routers/loginRouter'));

app.use('/recipes', require('./routers/recipesRouter'));

app.use('/images', express.static(path.resolve(__dirname, '../uploads')));

app.use(errorMiddleware);

module.exports = app;
