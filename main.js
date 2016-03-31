require('./overload-environment.js');
var Bluebird = require('bluebird');
var redis = require('redis');
Bluebird.promisifyAll(redis.RedisClient.prototype);
var SlackWebhookClient = require('./slack-webhook-client.js');
var TwitchClient = require('./twitch-client.js');
var streamComparer = require('./stream-comparer.js');
var StatusRedisStore = require('./status-redis-store.js');
var twitchChannelsToCheck = process.env.CHANNELS_TO_CHECK.split(',');

var slackWebhookClient = new SlackWebhookClient(process.env.SLACK_WEBHOOK_URL);
var twitchClient = new TwitchClient(process.env.TWITCH_BASE_URL);
var redisClient = redis.createClient(process.env.REDIS_URL);
var statusRedisStore = new StatusRedisStore(redisClient);


statusRedisStore.getStatus().done(function(previousStatus){
    if(previousStatus == null){
        previousStatus = [];
    }
    twitchClient.getStreams(twitchChannelsToCheck, function(error, streamResponse){
        var currentStatus = streamResponse.streams;
        
        var streamComparison = streamComparer.compareStreams(previousStatus, currentStatus);
        if(streamComparison.startedStreams.length > 0 || streamComparison.stoppedStreams.length > 0){
            var statusText = 'Twitch Broadcasting Update';
            streamComparison.startedStreams.forEach(function(stream) {
                statusText += '\n*' + stream.channel.display_name + '* started broadcasting ' + stream.game;
            });
            streamComparison.stoppedStreams.forEach(function(stream) {
                statusText += '\n*' + stream.channel.display_name + '* stopped broadcasting ' + stream.game;
            });
            slackWebhookClient.postMessage({ text: statusText }, function(){});
        } else {
            console.log('there were no changes');
        }
        statusRedisStore.setStatus(currentStatus)
        .done(redisClient.quit());
    });
});