const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const iceberg = require('./routes/iceberg');
const auth = require('./routes/auth');
const cors = require('cors')
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/iceberg_project', { promiseLibrary: require('bluebird')})
  .then(() => {
    console.log("connection successfull")
  })
  .catch((err) => console.error(err));

app.use(cors());
app.use(history());
if( process.env.NODE_ENV != "production") {
  app.use(logger("dev"));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/api/iceberg', iceberg);
app.use('/api/Auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// restful api error handler
app.use(function(err, req, res, next) {
  console.log(err);
  if (req.app.get('env') !== 'development') {
    delete err.stack;
  }
  res.status(err.statusCode || 500).json(err);
});

module.exports = app;
