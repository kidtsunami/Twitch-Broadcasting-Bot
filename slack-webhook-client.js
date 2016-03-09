var request = require('request');

function SlackWebHookClient(webhookURL) {
    this.webhookURL = webhookURL;
}

SlackWebHookClient.prototype.postMessage = function(message, callback){
    request.post({ uri: this.webhookURL, body: JSON.stringify(message) }, handleResponse(callback));
};

var handleResponse = function(callback){
    return function(error, response, body){
        if(error){
            console.log('Response Error: ' + error);
            callback(error);
        } else if(response.statusCode !== 200) {
            console.log('Invalid response code: ' + response.statusCode);
            callback('Response status code was invalid: ' + response.statusCode + '\n' + body);
        } else {
            callback(null);
        }
    };
};

module.exports = SlackWebHookClient;