exports.compareStreams = function(beforeStreams, afterStreams){
    var beforeStreamChannelIds = streamChannelIdsAsSet(beforeStreams);
    var afterStreamChannelIds = streamChannelIdsAsSet(afterStreams);
    var streamComparison = {
        stoppedStreams: beforeStreams.filter(isChannelIdNotInSet(afterStreamChannelIds)),
        startedStreams: afterStreams.filter(isChannelIdNotInSet(beforeStreamChannelIds))
    };
    
    return streamComparison;
}

function streamChannelIdsAsSet(streams){
    return new Set(Array.from(streams, getChannelId));
}

function getChannelId(stream){
    return stream.channel._id;
}

function isChannelIdNotInSet(channelIdSet){
    return function(stream){
        return !channelIdSet.has(getChannelId(stream));
    }
}