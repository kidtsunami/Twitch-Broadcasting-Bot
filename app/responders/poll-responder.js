require('../overload-environment.js');
var Promise = require('bluebird');
var redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);

var StatusRedisStore = require('../status-redis-store.js');
var TwitchClient = require('../twitch-client.js');
var TwitchStatusChecker = require('../twitch-status-checker.js');
var streamComparer = require('../stream-comparer.js');
var streamMessageFormatter = require('../stream-message-formatter.js');


module.exports.respondTo = function(command){
  console.log('responding to: ' + command);
  var twitchChannelsToCheck = process.env.CHANNELS_TO_CHECK.split(',');
  var twitchClient = TwitchClient.Create(process.env.TWITCH_BASE_URL, process.env.TWITCH_CLIENT_ID);
  var redisClient = redis.createClient(process.env.REDIS_URL);
  var statusStore = StatusRedisStore.Create(redisClient);  
  var twitchStatusChecker = TwitchStatusChecker.Create(twitchClient, statusStore, twitchChannelsToCheck);
  
  return twitchStatusChecker.getPreviousAndCurrentStatus()
    .then(streamComparer.compareStreams)
    .then(streamMessageFormatter.formatStatusChange)
    .catch(function(){
      redisClient.quit();
    })
    .then(function(status) {
      redisClient.quit();
      return status;
    });
}