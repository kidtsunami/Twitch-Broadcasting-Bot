/* eslint-env mocha */
var expect = require('expect.js');
var streamComparer = require('../app/stream-comparer.js');

describe("stream comparer", testStreamComparer);

function testStreamComparer(){
  describe("compareStreams", testCompareStreams);
}

function testCompareStreams(){
  it("exists as a public method", function(){
    expect(typeof streamComparer.compareStreams).to.eql('function'); 
  });
  
  describe("with valid data", testCompareStreamsWithValidData);
}

function testCompareStreamsWithValidData(){
  var stream1 = { channel: { _id: 1, display_name: 'stream1' } };
  var stream2 = { channel: { _id: 2, display_name: 'stream2' } };
  var stream3 = { channel: { _id: 3, display_name: 'stream3' } };
  var beforeStreams = [stream1, stream2];
  var afterStreams = [stream2, stream3];
  var streamStatuses = {
    previousStatus: beforeStreams,
    currentStatus: afterStreams
  }
  
  it("returns streamComparison", function(){
    var streamComparison = streamComparer.compareStreams(streamStatuses);
    expect(streamComparison).to.be.ok(); 
  });

  it("has stopped streams", function(){
    var streamComparison = streamComparer.compareStreams(streamStatuses);

    expect(typeof [streamComparison.stoppedStreams]).to.eql('object');
    expect(streamComparison.stoppedStreams.length).to.eql(1);
    expect(streamComparison.stoppedStreams[0].channel.display_name).to.eql('stream1');
  });

  it("has started streams", function(){
    var streamComparison = streamComparer.compareStreams(streamStatuses);

    expect(typeof streamComparison.startedStreams).to.eql('object');
    expect(streamComparison.startedStreams.length).to.eql(1);
    expect(streamComparison.startedStreams[0].channel.display_name).to.eql('stream3');
  });
}