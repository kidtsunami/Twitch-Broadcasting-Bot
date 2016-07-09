/* eslint-env mocha */
var expect = require('expect.js');
var nock = require('nock');

var TwitchClient = require('../app/twitch-client.js');
var redis = require('redis-mock');
var redisClient = redis.createClient();
var StatusRedisStore = require('../app/status-redis-store.js');

var testTwitchBaseURL = 'https://test.api.twitch.tv/kraken/';

var twitchClient = TwitchClient.Create(testTwitchBaseURL);
var statusStore = StatusRedisStore.Create(redisClient);

var channelsToRequest = ['channel1','channel2','channel3','channel4'];

var TwitchStatusChecker = require('../app/twitch-status-checker.js');
var twitchStatusChecker = TwitchStatusChecker.Create(twitchClient, statusStore, channelsToRequest);


describe('twitchStatusChecker', function(){
  beforeEach(flushRedis);
  afterEach(flushRedis);
  
  describe('getPreviousAndCurrentStatus', testGetPreviousAndCurrentStatus);
});

function flushRedis(){
  redisClient.flushdb();
}

function testGetPreviousAndCurrentStatus(){
  it('exists as a public method', function(){
    expect(typeof twitchStatusChecker.getPreviousAndCurrentStatus).to.eql('function');
  });
  
  describe('when statusStore is empty', function(){
    describe('when channel 4 is broadcasting', function(){
      var twitchNock = nockTwitchIsBroadcastingStream();
      it('has channel 4 is only in currentStatus', function(testDone){
        twitchStatusChecker.getPreviousAndCurrentStatus()
          .then(function(statuses){
            expect(twitchNock.isDone()).to.be(true);
            expect(statuses.currentStatus.length).to.be(1);
            expect(statuses.currentStatus[0].channel.display_name).to.be('channel4');
            expect(statuses.previousStatus.length).to.be(0);
          })
          .done(testDone);
      });
    });
    
    describe('when channel 4 is not broadcasting', function(){
      var twitchNock = nockTwitchIsNotBroadcasting();
      it('has no streams in current or previous status', function(testDone){
        twitchStatusChecker.getPreviousAndCurrentStatus()
          .then(function(statuses){
            expect(twitchNock.isDone()).to.be(true);
            expect(statuses.currentStatus.length).to.be(0);
            expect(statuses.previousStatus.length).to.be(0);
          })
          .done(testDone);
      });
    });
  });
  

  describe('when statusStore has channel4 broadcasting', function(){
    beforeEach(withChannel4Broadcasting);
    
    describe('when channel 4 is broadcasting', function(){
      var twitchNock = nockTwitchIsBroadcastingStream();
      it('has no streams current or previous status', function(testDone){
        twitchStatusChecker.getPreviousAndCurrentStatus()
          .then(function(statuses){
            expect(twitchNock.isDone()).to.be(true);
            expect(statuses.currentStatus.length).to.be(1);
            expect(statuses.currentStatus[0].channel.display_name).to.be('channel4');
            expect(statuses.previousStatus.length).to.be(1);
            expect(statuses.previousStatus[0].channel.display_name).to.be('channel4');
          })
          .done(testDone);
      });
    });
    
    describe('when channel 4 is not broadcasting', function(){
      var twitchNock = nockTwitchIsNotBroadcasting();
      it('has channel 4 is only in previousStatus', function(testDone){
        twitchStatusChecker.getPreviousAndCurrentStatus()
          .then(function(statuses){
            expect(twitchNock.isDone()).to.be(true);
            expect(statuses.previousStatus.length).to.be(1);
            expect(statuses.previousStatus[0].channel.display_name).to.be('channel4');
            expect(statuses.currentStatus.length).to.be(0);
          })
          .done(testDone);
      });
    });
  });
}

function nockTwitchIsBroadcastingStream(){
  var responseFile = '/responses/twitch-client/getStreamsOneIsBroadcasting.json';
  var requestPath = '/streams?channel=channel1,channel2,channel3,channel4';
  return nock(testTwitchBaseURL)
          .get(requestPath)
          .replyWithFile(200, __dirname + responseFile);
}

function nockTwitchIsNotBroadcasting(){
  var responseFile = '/responses/twitch-client/getStreamsNoOneIsBroadcasting.json';
  var requestPath = '/streams?channel=channel1,channel2,channel3,channel4';
  return nock(testTwitchBaseURL)
          .get(requestPath)
          .replyWithFile(200, __dirname + responseFile);
}

function withChannel4Broadcasting(runTest){
  var oldStatus = [{ channel: { _id: 80380440, display_name: 'channel4'},  game: 'Heroes of the Storm' }];
  statusStore.setStatus(oldStatus).done(function() { runTest(); });
}