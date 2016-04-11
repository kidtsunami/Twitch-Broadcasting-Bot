var streamComparer = require('./stream-comparer.js');

function TwitchBroadcastingBot(twitchClient, slackClient, statusStore){
  this.twitchClient = twitchClient;
  this.slackClient = slackClient;
  this.statusStore = statusStore;
}

TwitchBroadcastingBot.prototype.postChangesToSlack = function(twitchChannelsToCheck){
  var getStatusPromise = this.statusStore.getStatus()
    .bind(this)
    .then(function(previousStatus){
      var slackClient = this.slackClient;
      var twitchClient = this.twitchClient;
      var statusStore = this.statusStore;
      
      if(previousStatus == null){
        previousStatus = [];
      }
      var getStreamsPromise = twitchClient.getStreams(twitchChannelsToCheck)
        .then(function (streamResponse){
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
            return slackClient.postMessage({ text: statusText })
              .then(statusStore.setStatus(currentStatus));
          } else {
            console.log('there were no changes');
            return statusStore.setStatus(currentStatus);
          }
        });
      return getStreamsPromise;
    });
  return getStatusPromise;
};

module.exports = TwitchBroadcastingBot;