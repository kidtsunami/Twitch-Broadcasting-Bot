var expect = require('expect.js');

var slackMessageFormater = require('../app/slack-message-formatter.js');

var channel4 = {
  "_id": 19998280624,
  "game": "Heroes of the Storm",
  "preview": {
    "small": "http://static-cdn.jtvnw.net/previews-ttv/live_user_channel4-80x45.jpg",
    "medium": "http://static-cdn.jtvnw.net/previews-ttv/live_user_channel4-320x180.jpg",
    "large": "http://static-cdn.jtvnw.net/previews-ttv/live_user_channel4-640x360.jpg",
    "template": "http://static-cdn.jtvnw.net/previews-ttv/live_user_channel4-{width}x{height}.jpg"
  },
  "channel": {
    "status": "Fnatic vs. Liquid - ESL Heroes of the Storm Spring Regional Katowice - Group B Winners Match",
    "display_name": "channel4",
    "game": "Heroes of the Storm",
    "language": "en",
    "_id": 80380440,
    "name": "channel4",
    "logo": "https://static-cdn.jtvnw.net/jtv_user_pictures/channel4-profile_image-2f5c2e0a7c077df1-300x300.png",
    "banner": null,
    "video_banner": "https://static-cdn.jtvnw.net/jtv_user_pictures/channel4-channel_offline_image-5c787ac2274cce01-1920x1080.jpeg",
    "background": null,
    "profile_banner": "https://static-cdn.jtvnw.net/jtv_user_pictures/channel4-profile_banner-572863147147bba7-480.jpeg",
    "profile_banner_background_color": "#030a38",
    "url": "http://www.twitch.tv/channel4"
  }
}
var channel2 = {
  "_id": 1235615,
  "game": "Dutch Archer",
  "preview": {
    "small": "http://static-cdn.jtvnw.net/previews-ttv/live_user_channel4-80x45.jpg",
    "medium": "http://static-cdn.jtvnw.net/previews-ttv/live_user_channel4-320x180.jpg",
    "large": "http://static-cdn.jtvnw.net/previews-ttv/live_user_channel4-640x360.jpg",
    "template": "http://static-cdn.jtvnw.net/previews-ttv/live_user_channel4-{width}x{height}.jpg"
  },
  "channel": {
    "status": "Fnatic vs. Liquid - ESL Heroes of the Storm Spring Regional Katowice - Group B Winners Match",
    "display_name": "channel2",
    "game": "Dutch Archer",
    "language": "en",
    "_id": 84984984,
    "name": "channel2",
    "logo": "https://static-cdn.jtvnw.net/jtv_user_pictures/channel4-profile_image-2f5c2e0a7c077df1-300x300.png",
    "banner": null,
    "video_banner": "https://static-cdn.jtvnw.net/jtv_user_pictures/channel4-channel_offline_image-5c787ac2274cce01-1920x1080.jpeg",
    "background": null,
    "profile_banner": "https://static-cdn.jtvnw.net/jtv_user_pictures/channel4-profile_banner-572863147147bba7-480.jpeg",
    "profile_banner_background_color": "#030a38",
    "url": "http://www.twitch.tv/channel2"
  }
}

describe('slackMessageFormater', function(){
  describe('formatStatusChange', function() {
    it('exists as a method', function() {
      expect(typeof slackMessageFormater.formatStatusChange).to.eql('function');
    });
    
    describe('when no one is broadcasting', function(){
      var streamComparison = {
        startedStreams: [],
        stoppedStreams: []
      };
      
      it('has a blank message', function() {
        var message = slackMessageFormater.formatStatusChange(streamComparison);
        expect(message).to.eql(null);
        expect(message).to.be.false;
      });
    });
    
    describe('when channel2 started broadcasting', function(){
      var streamComparison = {
        startedStreams: [channel2],
        stoppedStreams: []
      };
      
      it('prints message for channel2', function() {
        var message = slackMessageFormater.formatStatusChange(streamComparison);
        expect(message).to.eql({ text: '*channel2* started broadcasting Dutch Archer' });
        expect(message).to.be.true;
      });
    });
    
    describe('when channel2 and channel4 started broadcasting', function(){
      var streamComparison = {
        startedStreams: [channel2, channel4],
        stoppedStreams: []
      };
      
      it('prints message for channel2 and channel4', function() {
        var message = slackMessageFormater.formatStatusChange(streamComparison);
        expect(message).to.eql({ text: '*channel2* started broadcasting Dutch Archer\n*channel4* started broadcasting Heroes of the Storm' });
        expect(message).to.be.true;
      });
    });
    
    describe('when channel2 started broadcasting and channel4 stopped', function(){
      var streamComparison = {
        startedStreams: [channel2],
        stoppedStreams: [channel4]
      };
      
      it('prints message for channel2 and channel4', function() {
        var message = slackMessageFormater.formatStatusChange(streamComparison);
        expect(message).to.eql({ text: '*channel2* started broadcasting Dutch Archer\n*channel4* stopped broadcasting Heroes of the Storm' });
        expect(message).to.be.true;
      });
    });
    
    describe('when channel2 started broadcasting and channel4 stopped', function(){
      var streamComparison = {
        startedStreams: [],
        stoppedStreams: [channel2,channel4]
      };
      
      it('prints message for channel2 and channel4', function() {
        var message = slackMessageFormater.formatStatusChange(streamComparison);
        expect(message).to.eql({ text: '*channel2* stopped broadcasting Dutch Archer\n*channel4* stopped broadcasting Heroes of the Storm' });
        expect(message).to.be.true;
      });
    });
    
    describe('when channel2 stopped broadcasting', function(){
      var streamComparison = {
        startedStreams: [],
        stoppedStreams: [channel2]
      };
      
      it('prints message for channel2 and channel4', function() {
        var message = slackMessageFormater.formatStatusChange(streamComparison);
        expect(message).to.eql({ text: '*channel2* stopped broadcasting Dutch Archer' });
        expect(message).to.be.true;
      });
    });
  });
});

 