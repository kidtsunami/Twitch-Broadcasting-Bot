var Promise = require("bluebird");

function TwitchStatusChecker(twitchClient, statusStore, twitchChannelsToCheck){
  this.twitchClient = twitchClient;
  this.statusStore = statusStore;
  this.twitchChannelsToCheck = twitchChannelsToCheck;
  
  this.parsePreviousAndCurrentStatus = function(redisStatusResponse, twitchResponse){
    var statuses = {
      previousStatus: redisStatusResponse || [],
      currentStatus: twitchResponse.streams || []
    };
    return statuses;
  }
  
  this.savePreviousStatus = function(statuses){
    return this.statusStore.setStatus(statuses.currentStatus)
      .then(statuses);
  }
}

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