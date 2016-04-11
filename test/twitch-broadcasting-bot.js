var expect = require('expect.js');
var nock = require('nock');

var SlackWebhookClient = require('../app/slack-webhook-client.js');
var TwitchClient = require('../app/twitch-client.js');
var Bluebird = require('bluebird');
var redis = require('redis-mock');
var redisClient = redis.createClient();
Bluebird.promisifyAll(redis.RedisClient.prototype);
var StatusRedisStore = require('../app/status-redis-store.js');

var testTwitchBaseURL = 'https://test.api.twitch.tv/kraken/';
var testSlackBaseURL = 'https://hooks.slack.com/';

var twitchClient = new TwitchClient(testTwitchBaseURL);
var slackClient = new SlackWebhookClient(testSlackBaseURL + 'webhookpath');
var statusStore = new StatusRedisStore(redisClient);

var TwitchBroadcastingBot = require('../app/twitch-broadcasting-bot.js');
var twitchBroadcastingBot = new TwitchBroadcastingBot(twitchClient, slackClient, statusStore);

var channelsToRequest = ['channel1','channel2','channel3','channel4'];

describe('twitchBroadcastingBot', function(){
  beforeEach(flushRedis);
  afterEach(flushRedis);
  
  describe('postChangesToSlack', testPostChangesToSlack);
});

function flushRedis(){
  redisClient.flushdb();
}

function testPostChangesToSlack(){
  it('exists as a public method', function(){
    expect(typeof twitchBroadcastingBot.postChangesToSlack).to.eql('function');
  });
  
  describe('when statusStore is empty', function(){
    describe('when channel 4 is broadcasting', function(){
      var twitchNock = nockTwitchIsBroadcastingStream();
      it('posts started broadcasting to slack', confirmStartedBroadcastingToSlack(twitchNock));
    });
    
    describe('when channel 4 is not broadcasting', function(){
      var twitchNock = nockTwitchIsNotBroadcasting();
      it('posts nothing to slack', confirmNothingBroadcastedToSlack(twitchNock));
    });
  });
  

  describe('when statusStore has channel4 broadcasting', function(){
    beforeEach(withChannel4Broadcasting);
    
    describe('when channel 4 is broadcasting', function(){
      var twitchNock = nockTwitchIsBroadcastingStream();
      it('posts nothing to slack', confirmNothingBroadcastedToSlack(twitchNock));
    });
    
    describe('when channel 4 is not broadcasting', function(){
      var twitchNock = nockTwitchIsNotBroadcasting();
      it('posts stopped broadcasting to slack', confirmStoppedBroadcastingToSlack(twitchNock));
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

function nockSlackMessage(message){
  return nock(testSlackBaseURL)
          .post('/webhookpath', message)
          .reply(200, 'OK');
}

function confirmStartedBroadcastingToSlack(twitchNock){
  return function(testDone){
    var slackMessage = '{"text":"\\n*channel4* started broadcasting Heroes of the Storm"}';
    var slackNock = nockSlackMessage(slackMessage);
    twitchBroadcastingBot.postChangesToSlack(channelsToRequest)
      .then(function(){
        expect(twitchNock.isDone()).to.be.true;
        expect(slackNock.isDone()).to.be.true;
      })
      .done(testDone);
  }
}

function confirmStoppedBroadcastingToSlack(twitchNock){
  return function(testDone){
    var slackMessage = '{"text":"\\n*channel4* stopped broadcasting Heroes of the Storm"}';
    var slackNock = nockSlackMessage(slackMessage);
    twitchBroadcastingBot.postChangesToSlack(channelsToRequest)
      .then(function(){
        expect(twitchNock.isDone()).to.be.true;
        expect(slackNock.isDone()).to.be.true;
      })
      .done(testDone);
  }
}

function confirmNothingBroadcastedToSlack(twitchNock){
  return function(testDone){
    twitchBroadcastingBot.postChangesToSlack(channelsToRequest)
      .then(function(){
        expect(twitchNock.isDone()).to.be.true;
      })
      .done(testDone);
  }
}

function withChannel4Broadcasting(runTest){
  var oldStatus = [{ channel: { _id: 80380440, display_name: 'channel4'},  game: 'Heroes of the Storm' }];
  statusStore.setStatus(oldStatus).done(function() { runTest(); });
}