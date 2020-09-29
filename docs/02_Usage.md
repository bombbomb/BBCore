## Quick Start

To begin, include the `BBCore` library in your html (The latest version is available at `https://static.bombbomb.com/js/BBCore.min.js`):

```html
<script type="text/javascript" src="https://static.bombbomb.com/js/BBCore.min.js"></script>
```

Then instantiate BBCore:

```javascript
var bb = new BBCore({ accessToken: '<your api key>'});
```

## Usage Examples

Take a look in the `examples/` directory to see some example implementation.

### Record a Video On Your Website
<img src="http://bbemail.s3.amazonaws.com/ART/githubImages/record_animation_250.gif" alt="" align="left" /> Embed a video recorder on your website and record to a BombBomb account without leaving your site.

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

**IMPORTANT NOTE**: If you intend to reuse the same BBCore object, it's HIGHLY recommended you call *getNewVideoGuid()* prior to calling *startVideoRecorder*. However, it's recommended that you otherwise destroy the BBCore object after the recorder has completed and create a new one.
&nbsp;


### Send a Video in an Email Through BombBomb <img src="http://bbemail.s3.amazonaws.com/ART/githubImages/send.jpg" alt="" align="right" />
 Wrap your video in a nicely designed template, add a personal written message if you like, and press send.

To send a video in your default template, use `videoQuickSend()`.

&nbsp;

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


### Register to receive real-time feedback via web hooks
Have your system be notified in real-time as events happen in your customer's BombBomb account.
[BombBomb's Webhooks](http://support.bombbomb.com/customer/portal/articles/2062941-bombbomb-webhooks) make
it easy to keep your system up to date.

&nbsp;

```javascript
bb.sendRequest('AddWebHook', {
    hookUrl: '<Your Listener URL>'
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
