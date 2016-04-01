require('./overload-environment.js');
var Bluebird = require('bluebird');
var redis = require('redis');
Bluebird.promisifyAll(redis.RedisClient.prototype);

var StatusRedisStore = require('./status-redis-store.js');
var SlackWebhookClient = require('./slack-webhook-client.js');
var TwitchClient = require('./twitch-client.js');
var TwitchBroadcastingBot = require('./twitch-broadcasting-bot.js');

var twitchChannelsToCheck = process.env.CHANNELS_TO_CHECK.split(',');
var slackClient = new SlackWebhookClient(process.env.SLACK_WEBHOOK_URL);
var twitchClient = new TwitchClient(process.env.TWITCH_BASE_URL);
var redisClient = redis.createClient(process.env.REDIS_URL);
var statusStore = new StatusRedisStore(redisClient);

var twitchBroadcastingBot = new TwitchBroadcastingBot(twitchClient, slackClient, statusStore);

twitchBroadcastingBot.postChangesToSlack(twitchChannelsToCheck, cleanUp);

function cleanUp(){
    redisClient.quit();
}