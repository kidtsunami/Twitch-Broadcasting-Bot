var TwitchClient = require('../app/twitch-client.js');
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
            it("returns streamResponse", function(testDone) {
                nockBroadcastingStream();
                twitchClient.getStream('channel1')
                    .then(function(streamResponse){
                        expect(streamResponse).to.not.be(undefined);
                    })
                    .done(testDone);
            });
            
            it("streamResponse has non-null stream", function(testDone) {
                nockBroadcastingStream();
                twitchClient.getStream('channel1')
                    .then(function(streamResponse){
                        expect(streamResponse).to.be.ok();
                        expect(typeof streamResponse).to.not.be('string');
                        expect(streamResponse.stream).to.be.ok();
                    })
                    .done(testDone);
            });
        });
       
        describe("when not broadcasting", function() {
            var nockNonBroadcastingStream = function(){
                nock(testBaseURL)
                    .get('/streams/channel1')
                    .replyWithFile(200, __dirname + '/responses/twitch-client/getStreamIsNotBroadcasting.json');
            }
            it("returns streamResponse", function(testDone) {
                nockNonBroadcastingStream();
                twitchClient.getStream('channel1')
                    .then(function(streamResponse){
                        expect(streamResponse).to.not.be(undefined);
                    })
                    .done(testDone);
            });
            
            it("streamResponse has null stream", function(testDone) {
                nockNonBroadcastingStream();
                twitchClient.getStream('channel1')
                    .then(function(streamResponse){
                        expect(streamResponse.stream).to.not.be.ok();
                    })
                    .done(testDone);
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
            it("returns streamResponse", function(testDone) {
                nockOneBroadcastingStreams();
                twitchClient.getStreams(channelsToRequest)
                    .then(function(streamResponse){
                        expect(streamResponse).to.not.be(undefined);
                    })
                    .done(testDone);
            });
            
            it("streamResponse has non-null streams", function(testDone) {
                nockOneBroadcastingStreams();
                twitchClient.getStreams(channelsToRequest)
                    .then(function(streamResponse){
                        expect(streamResponse).to.be.ok();
                        expect(typeof streamResponse).to.not.be('string');
                        expect(streamResponse.streams).to.be.ok();
                        expect(typeof streamResponse.streams).to.be('object');
                        expect(streamResponse.streams.length).to.be(1);
                    })
                    .done(testDone);
            });
        });
    });
});