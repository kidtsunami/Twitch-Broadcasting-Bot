var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(require('express-promise')());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/command', function(request, response){
  if(request.query.check_ssl == '1'){
    response.sendStatus(200);
  } else {
    response.status(404).send('You must be lost');
  }
});


app.post('/command', function(request, response){
  console.log(request.body);
  response.sendStatus(200);
});

var server = app.listen(3000, function(){
  console.log('example app');
});

module.exports = server;