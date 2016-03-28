var expect = require('expect.js');
var streamComparer = require('../stream-comparer.js');

describe("stream comparer", function(){
   describe("compareStreams", function(){
      it("exists as a public method", function(){
         expect(typeof streamComparer.compareStreams).to.eql('function'); 
      });
   });
});