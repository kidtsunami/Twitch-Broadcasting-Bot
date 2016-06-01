require('../overload-environment.js');
var Promise = require('bluebird');
var redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);

var StatusRedisStore = require('../status-redis-store.js');
var SlackWebhookClient = require('../slack-webhook-client.js');
var TwitchClient = require('../twitch-client.js');
var TwitchStatusChecker = require('../twitch-status-checker.js');
var streamComparer = require('../stream-comparer.js');
var slackMessageFormatter = require('../slack-message-formatter.js');

var twitchChannelsToCheck = process.env.CHANNELS_TO_CHECK.split(',');
var slackClient = new SlackWebhookClient(process.env.SLACK_WEBHOOK_URL);
var twitchClient = new TwitchClient(process.env.TWITCH_BASE_URL, process.env.TWITCH_CLIENT_ID);

module.exports.respondTo = function(command){
  var redisClient = redis.createClient(process.env.REDIS_URL);
  var statusStore = new StatusRedisStore(redisClient);  
  var twitchStatusChecker = new TwitchStatusChecker(twitchClient, statusStore, twitchChannelsToCheck);
  
  return twitchStatusChecker.getPreviousAndCurrentStatus()
    .then(streamComparer.compareStreams)
    .then(slackMessageFormatter.formatStatusChange)
    .then(function(status) {
      redisClient.quit();
      return status;
    });
}