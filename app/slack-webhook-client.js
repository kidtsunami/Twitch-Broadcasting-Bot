var request = require('request-promise');

SlackWebHookClient.Create = function(webhookURL){
  return new SlackWebHookClient(webhookURL);
}

function SlackWebHookClient(webhookURL) {
  this.webhookURL = webhookURL;
}

SlackWebHookClient.prototype.postMessage = function(message){
  if(message){
    var postOptions = {
      uri: this.webhookURL,
      body: message,
      json: true
    };
    return request.post(postOptions);
  } else {
    console.log('no message to post');
  }
};

module.exports = SlackWebHookClient;