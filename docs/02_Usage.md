## Quick Start

To begin, include the `BBCore` and `jQuery` libraries in your html (The latest version is available at `https://s3.amazonaws.com/static.bombbomb.com/js/BBCore.min.js`):

```html
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="//s3.amazonaws.com/static.bombbomb.com/js/BBCore.min.js"></script>
```

Then instantiate BBCore:

```javascript
var bb = new BBCore({ accessToken: '<your api key>'});
```

## Usage Examples

Take a look in the `examples/` directory to see some example implementation.

### Record a Video On Your Website
<div align="left" style="float:left;margin-right:12px;margin-bottom:12px;"><img src="http://bbemail.s3.amazonaws.com/ART/githubImages/record_animated_250.gif" alt="" /></div>Embed a video recorder on your website and record to a BombBomb account without leaving your site.

Create a video recorder and save a recording by calling `startVideoRecorder()`, specifying a css selector `target` into which you would like the recorder to appear.

<div style="clear:both;"></div>

```javascript
bb.startVideoRecorder({ target: '#recorderDiv'}, function (vidInfo) {
 if (confirm('Is this the take you would like to save?')) {
     bb.saveRecordedVideo('Our video!', vidInfo.videoId, vidInfo.filename, function (data) {
         alert('Your video has been saved!');
     });
 }
});
```

&nbsp;


### Send a Video in an Email Through BombBomb <div style="float:right;margin-left:12px;" align="right"><img src="http://bbemail.s3.amazonaws.com/ART/githubImages/send.jpg" alt=""  /></div>
 Wrap your video in a nicely designed template, add a personal written message if you like, and press send.

To send a video in your default template, use `videoQuickSend()`.

<div style="clear:both;"></div>

```javascript
bb.videoQuickSend({
    subject: 'Your Subject Line',
    video_id: vidInfo.videoId, // saved from the earlier call
    email_addresses: 'test@emailaddress.com',
    mobile_message: "Simple message to include"

}, function (data) {
    alert("You've sent a video! " + data.info);
});
```

&nbsp;

### Detailed Analytics
<div align="left" style="float:left;margin-right:12px;"><img src="http://bbemail.s3.amazonaws.com/ART/githubImages/tracking_static.jpg" alt="" /></div> View your email opens, link clicks and video plays. When you can see how people are interacting with your emails and videos you'll know exactly when to follow up.

<div style="clear:both;"></div>

&nbsp;

### Realtime Notifications <div align="right" style="float:right;margin-left:12px;"><img src="http://bbemail.s3.amazonaws.com/ART/githubImages/notification.jpg" alt="" /></div>
Download the free BombBomb app for your <a href="https://itunes.apple.com/us/app/bombbomb/id449319652" target="_blank">iOS</a> or <a href="https://play.google.com/store/apps/details?id=com.bombbomb.prod.android" target="_blank">Android</a> device and enable realtime notifications. View contact details or respond from your mobile device with one click.

<div style="clear:both;"></div>

