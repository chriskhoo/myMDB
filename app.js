// variables
var jwt_secret = 'whenwhywhowhatwherehow';

// required modules
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');

// set up express
var express = require('express');
var app = express();





// setup body parser
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(cookieParser());

// express jwt
app.use(
  expressJWT( {
    secret: jwt_secret
  } )
  .unless ({
    path: [
      '/api/signup',
      '/api/login',
      // {
      //   url: '/api/movies',
      //   methods: ['GET']
      // },
      // {
      //   url: '/api/actors',
      //   methods: ['GET']
      // },
      // {
      //   url: new RegExp('/api/movies.*/', 'i'),
      //   methods: ['GET']
      // },
      {
        url: new RegExp('/api.*/', 'i'),
        methods: ['GET']
      },
  ]

  })
);


var api_routes = require('./config/routes');
app.use('/api', api_routes);

var port = process.env.PORT|| 5000;
app.set('port', port);


app.listen(app.get('port'), function(){
  console.log('Server running at localhost:' + app.get( 'port'));
});

module.exports = app;
