var request = require('request');
var urlJoin = require('url-join');

function TwitchClient(baseURL){
    this.baseURL = baseURL;
}

TwitchClient.prototype.getStream = function(channel, callback) {
    var getStreamURL = urlJoin(this.baseURL, 'streams', channel);
    request.get(getStreamURL, handleGetStreamResponse(callback));
};

TwitchClient.prototype.getStreams = function(channels, callback) {
    var getStreamURL = urlJoin(this.baseURL, 'streams', '?channel=' + channels.join());
    request.get(getStreamURL, handleGetStreamResponse(callback));
};

var handleGetStreamResponse = function(callback){
    return function(error, response, body){
        if(error){
            console.log('getStream Error: ' + error);
            callback(error);
        } else if(response.statusCode !== 200) {
            console.log('getStream invalid response code: ' + response.statusCode);
            callback('Response status code was invalid: ' + response.statusCode + '\n' + body);
        } else {
            callback(null, JSON.parse(body));
        }
    };
};

module.exports = TwitchClient;