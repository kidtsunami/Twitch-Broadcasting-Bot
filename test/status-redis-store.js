var expect = require('expect.js');
var StatusRedisStore = require('../status-redis-store.js');
var redis = require('redis-mock');
var redisClient = redis.createClient();
var Bluebird = require('bluebird');

var basicData = { testData: 'blahhhh' };
var statusRedisStore = new StatusRedisStore(redisClient);

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
        statusRedisStore.getStatus().done(confirmStatusIsNull(testDone));
    });
    
    it('returns data if there', function(testDone){
        redisClient.setAsync('status', JSON.stringify(basicData))
        .bind(statusRedisStore)
        .then(statusRedisStore.getStatus)
        .done(confirmStatusIsBasicData(testDone));
    });
}

function confirmStatusIsNull(done){
    return function(status){
        expect(status).to.eql(null);
        done(); 
    }
}

function confirmStatusIsBasicData(done){
    return function(status){
        expect(status).to.eql(basicData);
        done(); 
    }
}

function testSetStatus(statusRedisStore){
    return function(){
        it('exists as a public method', function(){
            expect(typeof statusRedisStore.setStatus).to.eql('function');
        });
        
        it('sets the status', function(testDone){
            statusRedisStore.setStatus(basicData)
            .then(redisClient.getAsync('status'))
            .done(confirmStatusIsBasicData(testDone));
        });
    };
}