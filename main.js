var SlackWebhookClient = require('./slack-webhook-client.js');
var TwitchClient = require('./twitch-client.js');
var twitchChannelsToCheck = process.env.TWITCH_BROADCASTING_BOT_CHANNELS_TO_CHECK.split(',');

var slackWebhookClient = new SlackWebhookClient(process.env.TWITCH_BROADCASTING_BOT_SLACK_WEBHOOK_URL);
var twitchClient = new TwitchClient(process.env.TWITCH_BROADCASTING_BOT_TWITCH_BASE_URL);

twitchClient.getStreams(twitchChannelsToCheck, function(error, streamResponse){
    var statusText = 'Checking if the following channels are broadcasting: [' + twitchChannelsToCheck + ']\n';
    streamResponse.streams.forEach(function(stream) {
        statusText += '\n*' + stream.channel.display_name + '* is broadcasting ' + stream.game;
    });
    slackWebhookClient.postMessage({ text: statusText }, function(){});
}, this); 