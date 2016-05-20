var request = require('request-promise');
var urlJoin = require('url-join');

function TwitchClient(baseURL, clientId){
  this.baseURL = baseURL;
  this.clientId = clientId;
}

TwitchClient.prototype.getStream = function(channel) {
  var getStreamURL = urlJoin(this.baseURL, 'streams', channel);
  var getOptions = {
    uri: getStreamURL,
    json: true,
    headers: {
      'Client-ID': this.clientId
    }
  };
  return request.get(getOptions);
};

TwitchClient.prototype.getStreams = function(channels) {
  var getStreamURL = urlJoin(this.baseURL, 'streams', '?channel=' + channels.join());
  var getOptions = {
    uri: getStreamURL,
    json: true,
    headers: {
      'Client-ID': this.clientId
    }
  };
  return request.get(getOptions);
};

module.exports = TwitchClient;