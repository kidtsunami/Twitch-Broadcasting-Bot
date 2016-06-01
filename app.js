var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(require('express-promise')());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', (process.env.PORT || 3000));

var SlackCommandRouter = require('./app/slack-command-router.js');

var validTeamId = process.env.TEAM_ID;
var validToken = process.env.COMMAND_TOKEN;

app.get('/command', function(request, response){
  if(request.query.check_ssl == '1'){
    response.sendStatus(200);
  } else {
    response.status(404).send('You must be lost');
  }
});


app.post('/command', function(request, response){
  if(headersAreInvalid(request)){
    response.sendStatus(406);
  } else if(tokenAndTeamAreInvalid(request.body.token, request.body.team_id)) {
    response.sendStatus(401);  
  } else {
    var commandPromise = handleCommand(request.body);
    commandPromise.then(function(commandResponse) {
      response.status(200).send(commandResponse);  
    });
  }
});

function headersAreInvalid(request){
  return request.headers['content-type'] !== 'application/x-www-form-urlencoded';
}

function tokenAndTeamAreInvalid(token, team_id){
  return token !== validToken || team_id !== validTeamId;
}

function handleCommand(command){
  var slackCommandRouter = SlackCommandRouter.create();
  return slackCommandRouter.routeCommand(command);
}

var server = app.listen(app.get('port'), function(){
  console.log('twitchy listening on ' + app.get('port'));
});

module.exports = server;