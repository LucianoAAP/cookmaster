const express = require('express');
const errorMiddleware = require('./middlewares/error');

const app = express();
app.use(express.json());

app.use('/users', require('./routers/usersRouter'));

app.use('/login', require('./routers/loginRouter'));

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Ouvindo a porta ${PORT}`));
