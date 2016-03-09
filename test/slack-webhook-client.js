var SlackWebhookClient = require('../slack-webhook-client.js');
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
            nock('https://hooks.slack.com/')
                .post('/webhookpath', basicMessage)
                .reply(200, 'OK');
            it('should have null error', function(done){
                client.postMessage(basicMessage, function(error){
                    expect(error).to.not.be.ok();
                    done();
                }); 
            });
        });
    });
});