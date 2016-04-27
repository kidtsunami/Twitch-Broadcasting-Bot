var PollResponder = require('./responders/poll-responder.js');

SlackCommandRouter.create = function(){
  return new SlackCommandRouter();
}

function SlackCommandRouter(){
  
}

SlackCommandRouter.prototype.routeCommand = function(command){
  var responder;
  var responderId = firstWordOf(command.text);
  
  switch(responderId){
    case 'poll':
      responder = PollResponder.create();
      break;
  }
  
  return responder.respondTo(command);
}

function firstWordOf(text){
  return text.split(' ')[0];
}

module.exports = SlackCommandRouter;