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
    it('GET with check_ssl=1 is 200', function(testDone){
      request(server)
        .get('/command?check_ssl=1')
        .expect(200, testDone);
    });
    it('GET without check_ssl=1 is 404 you must be lost', function(testDone){
      request(server)
        .get('/command')
        .expect(404, testDone);
    });
  });
});