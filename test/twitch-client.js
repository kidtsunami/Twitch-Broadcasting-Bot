var TwitchClient = require('../twitch-client.js');
var expect = require('expect.js');
var nock = require('nock');

var testBaseURL = 'https://test.api.twitch.tv/kraken/';
describe("twitch client", function(){
    var twitchClient = new TwitchClient(testBaseURL);
    describe(".getStream", function(){
        it("exists as a public method on twitchClient", function(){
            expect(typeof twitchClient.getStream).to.eql('function'); 
        });
       
        describe("when broadcasting", function() {
            var nockBroadcastingStream = function(){
                nock(testBaseURL)
                    .get('/streams/channel1')
                    .replyWithFile(200, __dirname + '/responses/twitch-client/getStreamIsBroadcasting.json');
            }
            it("returns streamResponse", function(done) {
                nockBroadcastingStream();
                twitchClient.getStream('channel1', function(error, streamResponse){
                    expect(streamResponse).to.not.be(undefined);
                    done();
                });
            });
            
            it("streamResponse has non-null stream", function(done) {
                nockBroadcastingStream();
                twitchClient.getStream('channel1', function(error, streamResponse){
                    expect(streamResponse).to.be.ok();
                    expect(typeof streamResponse).to.not.be('string');
                    expect(streamResponse.stream).to.be.ok();
                    done();
                });
            });
        });
       
        describe("when not broadcasting", function() {
            var nockNonBroadcastingStream = function(){
                nock(testBaseURL)
                    .get('/streams/channel1')
                    .replyWithFile(200, __dirname + '/responses/twitch-client/getStreamIsNotBroadcasting.json');
            }
            it("returns streamResponse", function(done) {
                nockNonBroadcastingStream();
                twitchClient.getStream('channel1', function(error, streamResponse){
                    expect(streamResponse).to.not.be(undefined);
                    done();
                });
            });
            
            it("streamResponse has null stream", function(done) {
                nockNonBroadcastingStream();
                twitchClient.getStream('channel1', function(error, streamResponse){
                    expect(streamResponse.stream).to.not.be.ok();
                    done();
                });
            });
        });
    });
   
    describe(".getStreams", function(){
        describe("when one channel is broadcasting", function(){
            var channelsToRequest = ['channel1','channel2','channel3'];
            var nockOneBroadcastingStreams = function(){
                nock(testBaseURL)
                    .get('/streams?channel=channel1,channel2,channel3')
                    .replyWithFile(200, __dirname + '/responses/twitch-client/getStreamsOneIsBroadcasting.json');
            } 
            it("returns streamResponse", function(done) {
                nockOneBroadcastingStreams();
                twitchClient.getStreams(channelsToRequest, function(error, streamResponse){
                    expect(streamResponse).to.not.be(undefined);
                    done();
                });
            });
            
            it("streamResponse has non-null streams", function(done) {
                nockOneBroadcastingStreams();
                twitchClient.getStreams(channelsToRequest, function(error, streamResponse){
                    expect(streamResponse).to.be.ok();
                    expect(typeof streamResponse).to.not.be('string');
                    expect(streamResponse.streams).to.be.ok();
                    expect(typeof streamResponse.streams).to.be('object');
                    expect(streamResponse.streams.length).to.be(1);
                    done();
                });
            });
       });
   });
});