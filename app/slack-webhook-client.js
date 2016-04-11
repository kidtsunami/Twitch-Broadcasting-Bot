var request = require('request-promise');

function SlackWebHookClient(webhookURL) {
  this.webhookURL = webhookURL;
}

SlackWebHookClient.prototype.postMessage = function(message){
  var postOptions = {
    uri: this.webhookURL,
    body: message,
    json: true
  };
  return request.post(postOptions);
};

module.exports = SlackWebHookClient;