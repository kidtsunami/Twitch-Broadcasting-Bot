/* eslint-env mocha */
var expect = require('expect.js');
var StatusRedisStore = require('../app/status-redis-store.js');
var redis = require('redis-mock');
var redisClient = redis.createClient();
var Bluebird = require('bluebird');

var basicData = { testData: 'blahhhh' };
var statusRedisStore = StatusRedisStore.Create(redisClient);

Bluebird.promisifyAll(redis.RedisClient.prototype);

describe('statusRedisStore with empty redis', testStatusRedisStore);

function testStatusRedisStore(){
    beforeEach(flushRedis);
    afterEach(flushRedis);
    
    describe('getStatus', testGetStatus);
    describe('setStatus', testSetStatus);
}

function flushRedis(){
  redisClient.flushdb();
}

function testGetStatus(){
  it('exists as a public method', function(){
    expect(typeof statusRedisStore.getStatus).to.eql('function');
  });
  
  it('returns null when empty', function(testDone){
    statusRedisStore.getStatus()
    .then(confirmStatusIsNull)
    .done(testDone);
  });
  
  it('returns data if there', function(testDone){
    redisClient.setAsync('status', JSON.stringify(basicData))
    .bind(statusRedisStore)
    .then(statusRedisStore.getStatus)
    .then(confirmStatusIsBasicData)
    .done(testDone);
  });
}

function confirmStatusIsNull(status){
  expect(status).to.eql(null);
}

function confirmStatusIsBasicData(status){
  expect(status).to.eql(basicData); 
}

function testSetStatus(statusRedisStore){
  return function(){
    it('exists as a public method', function(){
      expect(typeof statusRedisStore.setStatus).to.eql('function');
    });
    
    it('sets the status', function(testDone){
      statusRedisStore.setStatus(basicData)
      .then(redisClient.getAsync('status'))
      .then(confirmStatusIsBasicData)
      .done(testDone);
    });
  };
}