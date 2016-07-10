require('./app/overload-environment.js');
var Bluebird = require('bluebird');
var redis = require('redis');
Bluebird.promisifyAll(redis.RedisClient.prototype);

var StatusRedisStore = require('./app/status-redis-store.js');
var SlackWebhookClient = require('./app/slack-webhook-client.js');
var TwitchClient = require('./app/twitch-client.js');
var TwitchStatusChecker = require('./app/twitch-status-checker.js');
var streamComparer = require('./app/stream-comparer.js');
var streamMessageFormatter = require('./app/stream-message-formatter.js');

var twitchChannelsToCheck = process.env.CHANNELS_TO_CHECK.split(',');
var slackClient = SlackWebhookClient.Create(process.env.SLACK_WEBHOOK_URL);
var twitchClient = TwitchClient.Create(process.env.TWITCH_BASE_URL, process.env.TWITCH_CLIENT_ID);
var redisClient = redis.createClient(process.env.REDIS_URL);
var statusStore = StatusRedisStore.Create(redisClient);

var twitchStatusChecker = TwitchStatusChecker.Create(
  twitchClient,
  statusStore,
  twitchChannelsToCheck);
  
var postMessagePromise = function(message){
  return slackClient.postMessage(message);
}
  
twitchStatusChecker.getPreviousAndCurrentStatus()
  .then(streamComparer.compareStreams)
  .then(streamMessageFormatter.formatStatusChange)
  .then(postMessagePromise)
  .done(cleanUp);

function cleanUp(){
  redisClient.quit();
}