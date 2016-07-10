exports.formatStatusChange = function (streamComparison){
  var statusMessages = [];

  if(streamComparison.startedStreams.length > 0 || streamComparison.stoppedStreams.length > 0){
    streamComparison.startedStreams.forEach(function(stream) {
      statusMessages.push('*' + stream.channel.display_name + '* started broadcasting ' + stream.game);
    });
    streamComparison.stoppedStreams.forEach(function(stream) {
      statusMessages.push('*' + stream.channel.display_name + '* stopped broadcasting ' + stream.game);
    });
  }
  
  if(statusMessages.length > 0){
    var statusText = statusMessages.join('\n');
    return { text: statusText };
  } else {
    return null;
  }
}