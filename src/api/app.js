const express = require('express');
const path = require('path');
const errorMiddleware = require('./middlewares/error');

const app = express();
app.use(express.json());

app.use('/users', require('./routers/usersRouter'));

app.use('/login', require('./routers/loginRouter'));

app.use('/recipes', require('./routers/recipesRouter'));

app.use('/images', express.static(path.resolve(__dirname, '../uploads')));

app.use(errorMiddleware);

module.exports = app;
