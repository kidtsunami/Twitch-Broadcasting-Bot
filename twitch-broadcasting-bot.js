var streamComparer = require('./stream-comparer.js');

function TwitchBroadcastingBot(twitchClient, slackClient, statusStore){
    this.twitchClient = twitchClient;
    this.slackClient = slackClient;
    this.statusStore = statusStore;
}

TwitchBroadcastingBot.prototype.postChangesToSlack = function(twitchChannelsToCheck, donePosting){
    this.statusStore.getStatus()
        .bind(this)
        .done(function(previousStatus){
            var slackClient = this.slackClient;
            var twitchClient = this.twitchClient;
            var statusStore = this.statusStore;
            
            if(previousStatus == null){
                previousStatus = [];
            }
            twitchClient.getStreams(twitchChannelsToCheck, function(error, streamResponse){
                var currentStatus = streamResponse.streams;
                var streamComparison = streamComparer.compareStreams(previousStatus, currentStatus);
                if(streamComparison.startedStreams.length > 0 || streamComparison.stoppedStreams.length > 0){
                    var statusText = '';
                    streamComparison.startedStreams.forEach(function(stream) {
                        statusText += '\n*' + stream.channel.display_name + '* started broadcasting ' + stream.game;
                    });
                    streamComparison.stoppedStreams.forEach(function(stream) {
                        statusText += '\n*' + stream.channel.display_name + '* stopped broadcasting ' + stream.game;
                    });
                    slackClient.postMessage({ text: statusText }, function(){
                        statusStore.setStatus(currentStatus).done(donePosting);
                    });
                } else {
                    console.log('there were no changes');
                    statusStore.setStatus(currentStatus).done(donePosting);
                }
            });
        });
};

module.exports = TwitchBroadcastingBot;