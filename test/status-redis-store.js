var expect = require('expect.js');
var StatusRedisStore = require('../status-redis-store.js');

describe('statusRedisStore', testStatusRedisStore);

function testStatusRedisStore(){
    var statusRedisStore = new StatusRedisStore();
    
    describe('getStatus', testGetStatus(statusRedisStore));
}

function testGetStatus(statusRedisStore){
    return function(){
        it('exists as a public method', function(){
            expect(typeof statusRedisStore.getStatus).to.eql('function');
        });  
    };
}