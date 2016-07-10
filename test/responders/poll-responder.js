/* eslint-env mocha */
var expect = require('expect.js');
var sinon = require('sinon');

var redis = require('redis');
var redisMock = require('redis-mock');
var StatusRedisStore = require('../../app/status-redis-store.js');
var TwitchClient = require('../../app/twitch-client.js');
var TwitchStatusChecker = require('../../app/twitch-status-checker.js');
var streamComparer = require('../../app/stream-comparer.js');
var slackMessageFormatter = require('../../app/slack-message-formatter.js');

process.env.CHANNELS_TO_CHECK = 'channel7,channel3,channel10';
process.env.TWITCH_BASE_URL = 'testtwitchbaseURL';
process.env.TWITCH_CLIENT_ID = 'testcliendid';
process.env.REDIS_URL = 'redisURL';

var mockTwitchStatusChecker;
var mockRedisClient;
var mockTwitchClient;
var mockStatusStore;

var createTwitchClientStub;
var createRedisClientStub;
var createStatusStoreStub;
var createTwitchStatusCheckerStub;

var getPreviousAndCurrentStatusStub;
var compareStreamsStub;
var formatStatusChangeStub;
var redisQuitStub;


var pollResponder = require('../../app/responders/poll-responder.js');

describe('pollResponder', function(){

  describe('respondTo', function() {
    beforeEach(function(){
      stubProcessMethods();
      stubCreateMethods();
    });

    afterEach(function(){
      restoreProcessStubs();
      restoreCreationStubs();
    });

    it('exists as a public method', function() {
      expect(typeof pollResponder.respondTo).to.eql('function');
    });

    it('creates twitchClient with proper url and client id', function(){
      pollResponder.respondTo(null);

      expect(createTwitchClientStub.calledWith('testtwitchbaseURL','testcliendid')).to.be(true);
    });

    it('creates redisClient with proper url', function(){
      pollResponder.respondTo(null);

      expect(createRedisClientStub.calledWith('redisURL')).to.be(true);
    });

    it('creates statusStore with redis client', function(){
      pollResponder.respondTo(null);

      expect(createStatusStoreStub.calledWith(mockRedisClient)).to.be(true);
    });

    it('creates twitchStatusChecker with clients and channelsToCheck', function(){
      var expectedChannels = ['channel7','channel3','channel10'];
      pollResponder.respondTo(null);

      expect(createTwitchStatusCheckerStub.calledWith(mockTwitchClient, mockStatusStore, expectedChannels)).to.be(true);
    });

    it('runs the correct promises', function(testDone){
      pollResponder.respondTo(null).then(function (result) {
        expect(result).to.be(3);
        expect(getPreviousAndCurrentStatusStub.called).to.be(true);
        expect(compareStreamsStub.calledWith(1)).to.be(true);
        expect(formatStatusChangeStub.calledWith(2)).to.be(true);
        expect(redisQuitStub.called).to.be(true);
        testDone();
      });
    });
  });
});

function stubProcessMethods(){
    mockTwitchStatusChecker = new TwitchStatusChecker(null, null, null);
    getPreviousAndCurrentStatusStub = sinon.stub(mockTwitchStatusChecker, 'getPreviousAndCurrentStatus').returns(Promise.resolve(1));

    compareStreamsStub = sinon.stub(streamComparer, 'compareStreams').returns(Promise.resolve(2));
    formatStatusChangeStub = sinon.stub(slackMessageFormatter, 'formatStatusChange').returns(Promise.resolve(3));

    mockRedisClient = redisMock.createClient();
    redisQuitStub = sinon.stub(mockRedisClient, 'quit');

    mockTwitchClient = new TwitchClient(null, null);
    mockStatusStore = new StatusRedisStore(null);
}

function stubCreateMethods(){
    createTwitchClientStub = sinon.stub(TwitchClient, 'Create').returns(mockTwitchClient);
    createRedisClientStub = sinon.stub(redis, 'createClient').returns(mockRedisClient);
    createStatusStoreStub = sinon.stub(StatusRedisStore, 'Create').returns(mockStatusStore);
    createTwitchStatusCheckerStub = sinon.stub(TwitchStatusChecker, 'Create').returns(mockTwitchStatusChecker);
}

function restoreProcessStubs(){
    getPreviousAndCurrentStatusStub.restore();
    compareStreamsStub.restore();
    formatStatusChangeStub.restore();
    redisQuitStub.restore();
}

function restoreCreationStubs(){
    createTwitchClientStub.restore();
    createRedisClientStub.restore();
    createStatusStoreStub.restore();
    createTwitchStatusCheckerStub.restore();
}