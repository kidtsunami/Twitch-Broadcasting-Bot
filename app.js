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
  console.log(request.headers);
  if(headersAreInvalid(request)){
    response.sendStatus(406);
  } else {
    response.sendStatus(200);  
  }
});

function headersAreInvalid(request){
  return request.headers['content-type'] !== 'application/x-www-form-urlencoded';
}

var server = app.listen(3000, function(){
  console.log('example app');
});

module.exports = server;