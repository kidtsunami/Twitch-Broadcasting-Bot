var streamComparer = require('./stream-comparer.js');
var Promise = require("bluebird");

function TwitchBroadcastingBot(twitchClient, slackClient, statusStore, twitchChannelsToCheck){
  this.twitchClient = twitchClient;
  this.slackClient = slackClient;
  this.statusStore = statusStore;
  this.twitchChannelsToCheck = twitchChannelsToCheck;
  
  this.buildMessageFromStatusComparison = function (previousStatus, currentStatus){
    var streamComparison = streamComparer.compareStreams(previousStatus, currentStatus);
    var statusText = '';

    if(streamComparison.startedStreams.length > 0 || streamComparison.stoppedStreams.length > 0){
      streamComparison.startedStreams.forEach(function(stream) {
        statusText += '\n*' + stream.channel.display_name + '* started broadcasting ' + stream.game;
      });
      streamComparison.stoppedStreams.forEach(function(stream) {
        statusText += '\n*' + stream.channel.display_name + '* stopped broadcasting ' + stream.game;
      });
    }
    
    return statusText;
  }
}

TwitchBroadcastingBot.prototype.postChangesToSlack = function(){
  return this.getAndUpdateChangesToStatus()
    .then(function(message){
      if(message){
        return this.slackClient.postMessage({ text: message });
      } else {
        return null;
      }
    });
};

TwitchBroadcastingBot.prototype.getAndUpdateChangesToStatus = function(){
  return Promise.all([
      this.statusStore.getStatus(),
      this.twitchClient.getStreams(this.twitchChannelsToCheck)
    ])
    .bind(this)
    .then(function(values){
      var previousStatus = values[0]
      var currentStatus = values[1].streams;
      var message = this.buildMessageFromStatusComparison(previousStatus, currentStatus);
      return this.statusStore.setStatus(currentStatus).then(function(){
        return message;
      });
    });
}

module.exports = TwitchBroadcastingBot;