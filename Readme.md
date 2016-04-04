Twitch Broadcasting Bot
=======================
A bot that queries Twitch and posts to a Slack WebHook when a channel has started broadcasting.

[![Circle CI](https://circleci.com/gh/kidtsunami/Twitch-Broadcasting-Bot.svg?style=svg)](https://circleci.com/gh/kidtsunami/Twitch-Broadcasting-Bot)

Environment Variables
---------------------
|Name|Description|Example|
|----|----|---|
|CHANNELS_TO_CHECK|Comma delimited list of twitch channels to check to see if they are broadcasting|halo,thekidtsunami|
|SLACK_WEBHOOK_URL|The full url of the slack webhook to post status updates to|https://hooks.slack.com/webhookpath|
|TWITCH_BASE_URL|The base url of the twitch API, should be their kraken one...|https://api.twitch.tv/kraken/|
|REDIS_URL|The url for Redis|(Blank in a local environment...)|

Suggested Development Environment
-----------------------
This was originally developed on Mac OS X (10.11.3) using [VS Code](https://code.visualstudio.com/). VS Code is a free IDE from Microsoft that is... pretty cool.

They have a wonderful page for [NodeJS Applications with VS Code](https://code.visualstudio.com/docs/runtimes/nodejs). 

Depends on
----------
### Redis
Using redis to store the state so the bot only posts about changes in the state of channels.

[Redis Quickstart](http://redis.io/topics/quickstart)