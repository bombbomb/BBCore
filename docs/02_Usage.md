## Usage Examples!

To begin, include the `BBCore` and `jQuery` libraries in your page:

```html
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="/app/js/bbcore-min.js"></script>
```

Then instantiate BBCore:

```javascript
var bb = new BBCore({ accessToken: '<your api key>'});
```

Then create a video recorder, and save a recording, being by calling `startVideoRecorder` specifying a css selctor `target` into which you would like the recorder to appear.

```javascript
bb.startVideoRecorder({ target: '#recorderDiv'}, function (vidInfo) {
 if (confirm('Is this the take you would like to save?')) {
     bb.saveRecordedVideo('Our video!', vidInfo.videoId, vidInfo.filename, function (data) {
         alert('Your video has been saved!');
     });
 }
});
```
