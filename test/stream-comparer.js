var expect = require('expect.js');
var streamComparer = require('../stream-comparer.js');

describe("stream comparer", function(){
   describe("compareStreams", function(){
      it("exists as a public method", function(){
         expect(typeof streamComparer.compareStreams).to.eql('function'); 
      });
      
      it("returns streamComparison", function(){
         var streamComparison = streamComparer.compareStreams(null, null);
         expect(streamComparison).to.be.ok(); 
      });
      
      it("has stopped streams", function(){
         var streamComparison = streamComparer.compareStreams(null, null);
         
         expect(typeof [streamComparison.stoppedStreams]).to.eql('object');
      });
      
      it("has started streams", function(){
         var streamComparison = streamComparer.compareStreams(null, null);
         
         expect(typeof streamComparison.startedStreams).to.eql('object');
      });
   });
});