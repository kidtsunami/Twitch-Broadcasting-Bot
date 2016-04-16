var express = require('express');
var app = express();
app.use(require('express-promise')());

app.get('/command', function(request, response){
  console.log(request.query);
  if(request.query.check_ssl == '1'){
    response.sendStatus(200);
  } else {
    response.status(404).send('You must be lost');
  }
});

var server = app.listen(3000, function(){
  console.log('example app');
});

module.exports = server;