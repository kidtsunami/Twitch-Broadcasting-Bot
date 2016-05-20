require('./app/overload-environment.js');
var Bluebird = require('bluebird');
var redis = require('redis');
Bluebird.promisifyAll(redis.RedisClient.prototype);

var StatusRedisStore = require('./app/status-redis-store.js');
var SlackWebhookClient = require('./app/slack-webhook-client.js');
var TwitchClient = require('./app/twitch-client.js');
var TwitchStatusChecker = require('./app/twitch-status-checker.js');

var twitchChannelsToCheck = process.env.CHANNELS_TO_CHECK.split(',');
var slackClient = new SlackWebhookClient(process.env.SLACK_WEBHOOK_URL);
var twitchClient = new TwitchClient(process.env.TWITCH_BASE_URL, process.env.TWITCH_CLIENT_ID);
var redisClient = redis.createClient(process.env.REDIS_URL);
var statusStore = new StatusRedisStore(redisClient);

var twitchStatusChecker = new TwitchStatusChecker(
  twitchClient,
  slackClient,
  statusStore,
  twitchChannelsToCheck);

twitchStatusChecker.postChangesToSlack().done(cleanUp);

function cleanUp(){
  redisClient.quit();
}