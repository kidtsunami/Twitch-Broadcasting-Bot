var expect = require('expect.js');
var request = require('supertest');
var sinon = require('sinon');

var SlackCommandRouter = require('../app/slack-command-router.js');

process.env.TEAM_ID = 'T0001';
process.env.COMMAND_TOKEN = 'validtoken';

describe('command app', function(){
  var server;
  beforeEach(function(){
    server = require('../app.js');
  });
  afterEach(function(){
    server.close();
  });
  
  describe('/command', function(){
    describe('GET', function(){
      it('with check_ssl=1 is 200', function(testDone){
        request(server)
          .get('/command?check_ssl=1')
          .expect(200, testDone);
      });
      it('without check_ssl=1 is 404 you must be lost', function(testDone){
        request(server)
          .get('/command')
          .expect(404, testDone);
      });  
    });
    describe('POST', function(){
      describe('with missing header', function(){
        it('should return 406', function(testDone){
          request(server)
            .post('/command')
            .expect(406, testDone);
        });
      });
      describe('with invalid headers', function(){
        it('should return 406', function(testDone){
          request(server)
            .post('/command')
            .set('content-type', 'application/invalid')
            .expect(406, testDone);
        });
      });
      describe('with valid headers', function(){
        var contentType = 'application/x-www-form-urlencoded';
        var commandForm;
        
        beforeEach(function(){
          commandForm = {
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
        });
        
        describe('with invalidToken', function(){
          beforeEach(function(){
            commandForm.token = 'invalidtoken';
          });
          
          it('should return 401', function(testDone){
            request(server)
              .post('/command')
              .type('form')
              .send(commandForm)
              .expect(401, testDone);
          });
        });
        
        describe('with invalidTeam', function(){
          beforeEach(function(){
            commandForm.team_id = 'invalidteamid';
          });
          
          it('should return 401', function(testDone){
            request(server)
              .post('/command')
              .type('form')
              .send(commandForm)
              .expect(401, testDone);
          });
        });
        
        describe('with valid teamId and token', function(){
          var slackCommandRouter;
          var slackCommandRouterCreateStub;
          
          beforeEach(function(){
            slackCommandRouter = {};
            slackCommandRouter.routeCommand = sinon.stub();
            
            slackCommandRouterCreateStub = sinon.stub(SlackCommandRouter, 'create');
            slackCommandRouterCreateStub.returns(slackCommandRouter);
          });
          
          afterEach(function(){
            slackCommandRouterCreateStub.restore();
          });
          
          it('should pass command to commandRouter', function(testDone){
            request(server)
              .post('/command')
              .type('form')
              .send(commandForm)
              .end(function(){
                expect(slackCommandRouter.routeCommand.calledWith(commandForm)).to.be(true);
                testDone();
              });
          });
        });
      });
    });
  });
});