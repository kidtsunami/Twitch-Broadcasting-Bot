var SlackWebhookClient = require('../app/slack-webhook-client.js');
var expect = require('expect.js');
var nock = require('nock');

describe('slack webhook client', function(){
  var client = new SlackWebhookClient('https://hooks.slack.com/webhookpath');
  describe('.postMessage', function(){
    it('exists as a public method on slackClient', function(){
      expect(typeof client.postMessage).to.be('function'); 
    });

    describe('with a message', function(){
      var basicMessage = {
        text: 'test message'
      };
      var slackNock = nock('https://hooks.slack.com/')
        .post('/webhookpath', basicMessage)
        .reply(200, 'OK');
      it('should have null error', function(testDone){
        client.postMessage(basicMessage)
          .then(expectNockIsDone(slackNock))
          .done(testDone);
      });
    });
  });
});

function expectNockIsDone(expectedNock){
  return function(){
      expect(expectedNock.isDone()).to.be.true;
  };
}