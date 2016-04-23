var expect = require('expect.js');
var request = require('supertest');

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
      describe('with incorrect header', function(){
        var invalidHeaders = {
          reqheaders: {
            'content-type': 'application/invalid'
          }
        };
        it('should return 406', function(testDone){
          request(server, invalidHeaders)
            .post('/command')
            .expect(406, testDone);
        });
      });
    });
  });
});