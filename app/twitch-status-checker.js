var streamComparer = require('./stream-comparer.js');
var Promise = require("bluebird");

function TwitchStatusChecker(twitchClient, slackClient, statusStore, twitchChannelsToCheck){
  this.twitchClient = twitchClient;
  this.slackClient = slackClient;
  this.statusStore = statusStore;
  this.twitchChannelsToCheck = twitchChannelsToCheck;
  
  this.parsePreviousAndCurrentStatus = function(redisStatusResponse, twitchResponse){
    var statuses = {
      previousStatus: redisStatusResponse,
      currentStatus: twitchResponse.streams
    };
    return statuses;
  }
  
  this.savePreviousStatus = function(statuses){
    return this.statusStore.setStatus(statuses.currentStatus)
      .then(function() { return statuses; });
  }
  
  this.buildMessageFromStatusComparison = function (statuses){
    var streamComparison = streamComparer.compareStreams(statuses.previousStatus, statuses.currentStatus);
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

TwitchStatusChecker.prototype.postChangesToSlack = function(){
  return this.getPreviousAndCurrentStatus()
    .then(this.buildMessageFromStatusComparison)
    .then(function(message){
      if(message){
        return this.slackClient.postMessage({ text: message });
      } else {
        return null;
      }
    });
};

TwitchStatusChecker.prototype.getPreviousAndCurrentStatus = function(){
  return Promise.join(
      this.statusStore.getStatus(),
      this.twitchClient.getStreams(this.twitchChannelsToCheck),
      this.parsePreviousAndCurrentStatus
    )
    .bind(this)
    .then(this.savePreviousStatus);
}

module.exports = TwitchStatusChecker;