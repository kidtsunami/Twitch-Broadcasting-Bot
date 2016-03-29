var expect = require('expect.js');
var StatusRedisStore = require('../status-redis-store.js');
var redis = require('redis-mock');
var redisClient = redis.createClient();
var Bluebird = require('bluebird');
var basicData = { testData: 'blahhhh' };

Bluebird.promisifyAll(redis.RedisClient.prototype);

describe('statusRedisStore with empty redis', testStatusRedisStore);

function testStatusRedisStore(){
    beforeEach(flushRedis);
    afterEach(flushRedis);
    var statusRedisStore = new StatusRedisStore(redisClient);
    
    describe('getStatus', testGetStatus(statusRedisStore));
    describe('setStatus', testSetStatus(statusRedisStore));
}

function flushRedis(){
    redisClient.flushdb();
}

function testGetStatus(statusRedisStore){
    return function(){
        it('exists as a public method', function(){
            expect(typeof statusRedisStore.getStatus).to.eql('function');
        });
        
        it('returns null when empty', function(done){
            statusRedisStore.getStatus().done(function(status){
                expect(status).to.eql(null);
                
                done(); 
            });
        });
        
        it('returns data if there', function(done){
            
            redisClient.setAsync('status', JSON.stringify(basicData))
            .done(function(){
                statusRedisStore.getStatus().done(function(status){
                    expect(status).to.eql(basicData);
                    done(); 
                });
            });
        });
    };
}

function testSetStatus(statusRedisStore){
    return function(){
        it('exists as a public method', function(){
            expect(typeof statusRedisStore.setStatus).to.eql('function');
        });
        
        it('sets the status', function(done){
            statusRedisStore.setStatus(basicData).done(function(){
                redisClient.getAsync('status')
                .done(function(status){
                    expect(JSON.parse(status)).to.eql(basicData);
                    done();
                });
            });
        });
    };
}