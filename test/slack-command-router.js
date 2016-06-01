var sinon = require('sinon');
var expect = require('expect.js');
var Promise = require('bluebird');

var pollResponder = require('../app/responders/poll-responder.js');

describe('Slack Command Router', function(){
  var commandRouter = require('../app/slack-command-router.js').create();
  
  describe('routeCommand', function(){
    var commandForm;
    var expectedResponse = { random: 'test response' };
    var pollResponderStub;
    
    beforeEach(function(){
      command = {
        token: 'validtoken',
        team_id: 'T0001',
        team_domain: 'example',
        channel_id: 'C2147483705',
        channel_name: 'test',
        user_id: 'U2147483697',
        user_name: 'Steve',
        command: '/weather',
        text: '94070',
        response_url: 'https://hooks.slack.com/commands/1234/5678' 
      };
      
      pollResponderStub = sinon.stub(pollResponder, 'respondTo').returns(Promise.resolve(expectedResponse));
    });
    
    it('routes poll to pollResponder', function(testDone){
      command.text = 'poll';
      
      var commandPromise = commandRouter.routeCommand(command);
      
      
      commandPromise.then(function(commandResponse) {
        expect(pollResponder.respondTo.calledWith(command)).to.be(true);
        expect(commandResponse).to.be(expectedResponse);
      })
        .done(testDone);
    });
  });
});