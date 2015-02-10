## Quick Start

To begin, include the `BBCore` and `jQuery` libraries in your html:

```html
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="/app/js/bbcore-min.js"></script>
```

Then instantiate BBCore:

```javascript
var bb = new BBCore({ accessToken: '<your api key>'});
```
## Usage Examples

### Record a Video On Your Website
Embed a video recorder on your website and record to a BombBomb account without without leaving your site.

Then create a video recorder, and save a recording, being by calling `startVideoRecorder()` specifying a css selector `target` into which you would like the recorder to appear.

```javascript
bb.startVideoRecorder({ target: '#recorderDiv'}, function (vidInfo) {
 if (confirm('Is this the take you would like to save?')) {
     bb.saveRecordedVideo('Our video!', vidInfo.videoId, vidInfo.filename, function (data) {
         alert('Your video has been saved!');
     });
 }
});
```


### Send a video in an email through BombBomb
Wrap your video in a nicely designed template, add a personal written message if you like, and press send.

To send a video in your default template, use `videoQuickSend()`

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
