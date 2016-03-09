Twitch Broadcasting Bot
=======================
A bot that queries Twitch and posts to a Slack WebHook when a channel has started broadcasting.

Environment Variables
---------------------
|Name|Description|Example|
|----|----|---|
|TWITCH_BROADCASTING_BOT_CHANNELS_TO_CHECK|Comma delimited list of twitch channels to check to see if they are broadcasting|halo,thekidtsunami|
|TWITCH_BROADCASTING_BOT_SLACK_WEBHOOK_URL|The full url of the slack webhook to post status updates to|https://hooks.slack.com/webhookpath|
|TWITCH_BROADCASTING_BOT_TWITCH_BASE_URL|The base url of the twitch API, should be their kraken one...|https://api.twitch.tv/kraken/|