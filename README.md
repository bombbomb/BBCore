# BBCore

[![Build Status](https://travis-ci.org/bombbomb/BBCore.svg?branch=master)](https://travis-ci.org/bombbomb/BBCore) [![Code Climate](https://codeclimate.com/github/bombbomb/BBCore/badges/gpa.svg)](https://codeclimate.com/github/bombbomb/BBCore)

BombBomb makes it easy to build relationships with simple videos. Use this JavaScript API to record a video on your website, email it within a clean, beautiful design, and receive detailed analytics on opens, click and plays. With the free BombBomb app you can receive push notifications and respond right away when someone interacts with your email.

## Quick Start

To begin, include the `BBCore` library in your html (The latest version is available at `https://static.bombbomb.com/js/BBCore.min.js`):

```html
<script
  type="text/javascript"
  src="https://static.bombbomb.com/js/BBCore.min.js"
></script>
```

Then instantiate BBCore:

```javascript
const bb = new BBCore({
  accessToken: "<your access token or api key>",
});
```

## Usage Examples

Take a look in the `examples/` directory to see a simple example implementation.

### Record a Video On Your Website

<img src="http://bbemail.s3.amazonaws.com/ART/githubImages/record_animation_250.gif" alt="" align="left" /> Embed a video recorder on your website and record to a BombBomb account without leaving your site.

Create a video recorder by calling `startVideoRecorder()`, specifying a css selector `target` indicating the root container element where you want the recorder to appear.

The second argument is a callback function that will be called when the user stops recording.

<div style="clear:both;"></div>

```javascript
bb.startVideoRecorder({ target: "#recorderDiv" }, function (vidInfo) {
  if (confirm("Is this the take you would like to save?")) {
    bb.saveRecordedVideo(
      "Our video!",
      vidInfo.videoId,
      vidInfo.filename,
      function (data) {
        alert("Your video has been saved!");
      }
    );
  }
});
```

**IMPORTANT NOTE**: After saving a video, you must call _getNewVideoGuid()_ prior to calling _startVideoRecorder_ or you will be recording over the video you just saved. Alternatively, destroy the BBCore object after the recorder has completed and create a new one for each recording saved.
&nbsp;

### Send a Video in an Email Through BombBomb <img src="http://bbemail.s3.amazonaws.com/ART/githubImages/send.jpg" alt="" align="right" />

Wrap your video in a nicely designed template, add a personal written message if you like, and press send.

To send a video in your default template, use `videoQuickSend()`.

&nbsp;

```javascript
bb.videoQuickSend(
  {
    subject: "Your Subject Line",
    video_id: vidInfo.videoId, // saved from the earlier call
    email_addresses: "test@emailaddress.com",
    mobile_message: "Simple message to include",
  },
  function (data) {
    alert("You've sent a video! " + data.info);
  }
);
```

&nbsp;

### Register to receive real-time feedback via web hooks

Have your system be notified in real-time as events happen in your customer's BombBomb account.
[BombBomb's Webhooks](https://support.bombbomb.com/hc/en-us/articles/115000439932-How-do-I-set-up-BombBomb-webhooks) make
it easy to keep your system up to date.

&nbsp;

```javascript
bb.sendRequest("AddWebHook", {
  hookUrl: "<Your Listener URL>",
});
```

&nbsp;

### Detailed Analytics

<img src="http://bbemail.s3.amazonaws.com/ART/githubImages/tracking_static.png" alt="" align="left" /> View your email opens, link clicks and video plays. When you can see how people are interacting with your emails and videos you'll know exactly when to follow up.

&nbsp;

&nbsp;

&nbsp;

### Realtime Notifications <img src="http://bbemail.s3.amazonaws.com/ART/githubImages/notification.jpg" alt="" align="right" />

Download the free BombBomb app for your <a href="https://itunes.apple.com/us/app/bombbomb/id449319652" target="_blank">iOS</a> or <a href="https://play.google.com/store/apps/details?id=com.bombbomb.prod.android" target="_blank">Android</a> device and enable realtime notifications. View contact details or respond from your mobile device with one click.

&nbsp;

&nbsp;

[See the full API Documentation here](docs/build/BBCore.combined.md)

RipSecrets<br><br>
We implement pipeline secret scanning on all pull request events to prevent credentials from being merged. If the pipeline scanner detects a secret in your changed files it will gate the pull request and you will need to purge the found credential from your code and re-open the PR. To prevent getting gated by this tool and as best practice you should install the secret scanner locally in a pre-commit hook to prevent the secret from ever being committed to the repo in the first place. You can find documentation on how to set it up locally [here](https://bombbomb.atlassian.net/wiki/spaces/CORE/pages/2039775312/Pipeline+Secret+Scanner+Local+Setup)<br>
Ripsecrets has ways to bypass secret scanning although we should not be ignoring secrets that turn up in the scans. If something is out of your control and blocking the pipeline you can bypass it in one of the following ways<br>
1. Adding "# pragma: allowlist secret" to the end of the line with the secret.<br>
2. Adding the specific secret underneath the "[secrets]" block in .secretsignore<br>
3. Adding the filepath to ignore the whole file aboove the "[secrets]" block in .secretsignore