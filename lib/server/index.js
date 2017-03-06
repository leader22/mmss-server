const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const day = 24 * (60 * (1000 * 60));

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(session({
  name: 'mmss-server-sid',
  secret: 'mmss-server',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * day,
  },
}));

app.use('/', require('./routes/index'));
app.use('/', require('./routes/authorized'));

module.exports = app;
