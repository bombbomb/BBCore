# BBCore

[![Build Status](https://travis-ci.org/bombbomb/BBCore.svg?branch=master)](https://travis-ci.org/bombbomb/BBCore) [![Code Climate](https://codeclimate.com/github/bombbomb/BBCore/badges/gpa.svg)](https://codeclimate.com/github/bombbomb/BBCore) [![Test Coverage](https://codeclimate.com/github/bombbomb/BBCore/badges/coverage.svg)](https://codeclimate.com/github/bombbomb/BBCore)

A Javascript API enabling the use of BombBomb's video recording, sending and more!
## Usage Examples!

To begin, include the `BBCore` and `jQuery` libraries in your html:

```html
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="/app/js/bbcore-min.js"></script>
```

Then instantiate BBCore:

```javascript
var bb = new BBCore({ accessToken: '<your api key>'});
```


### Capture a video with user's webcam
Then create a video recorder, and save a recording, being by calling `startVideoRecorder()` specifying a css selctor `target` into which you would like the recorder to appear.

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
To send that video in your default template, use `videoQuickSend()`

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
# BBCore





* * *

### BBCore.contact(properties) 

namespace BBCore.contact

**Parameters**

**properties**: `contactProperties`, namespace BBCore.contact




# contacts

Adds a Contact to Contacts Collection



* * *


# contacts

fds



* * *

### contacts.video(properties) 

namespace

**Parameters**

**properties**: , namespace



### contacts.add(video) 

Adds a Video to the collection

**Parameters**

**video**: `video`, Adds a Video to the collection

**Returns**: `videos`


### contacts.login(uid, pwd, success) 

fds

**Parameters**

**uid**: `string`, fds

**pwd**: `string`, fds

**success**: `responseSuccess`, fds



### contacts.credentialsSaved() 

Returns bool for whether or not a prior authentication is stored locally

**Returns**: `boolean`


### contacts.saveCredentials(uid, pwd) 

Save credentials to local storage (not recommended)

**Parameters**

**uid**: `string`, User ID/Email Address

**pwd**: `string`, Password



### contacts.resumeStoredSession(success, err) 

Authenticates from previously stored credentials

**Parameters**

**success**: `responseSuccess`, Authenticates from previously stored credentials

**err**: `responseSuccess`, Authenticates from previously stored credentials



### contacts.isAuthenticated() 

Returns bool for authentication state

**Returns**: `boolean | *`


### contacts.verifyKey(key, complete) 

Validates the given key

**Parameters**

**key**: `string`, Validates the given key

**complete**: `responseSuccess`, Validates the given key



### contacts.storeKey(key) 

fds

**Parameters**

**key**: , fds



### contacts.getServerUrl() 

fds

**Returns**: `BBCore.apiServer | * | BBCore.CONFIG.SERVER_API_URL`


### contacts.getRequestUrl() 

Returns the fully qualified URL for BB API

**Returns**: `string`


### contacts.sendRequest(method, params, success, error) 

Sends a request to the specified method of the [BombBomb API](//bombbomb.com/api)

**Parameters**

**method**: `string`, The method name to call

**params**: `requestParameters`, The parameters to send with the request

**success**: `responseSuccess`, A callback when the request succeeds

**error**: `responseSuccess`, A callback when the request fails



### contacts.getLists(success) 

Retrieves Contact Lists

**Parameters**

**success**: `responseSuccess`, Retrieves Contact Lists



### contacts.createList(listName, success) 

Creates a Contact List and returns the Guid

**Parameters**

**listName**: `string`, Creates a Contact List and returns the Guid

**success**: `responseSuccess`, Creates a Contact List and returns the Guid



### contacts.getContact(contactId, success) 

Retrieves a Contact

**Parameters**

**contactId**: `string`, Retrieves a Contact

**success**: `responseSuccess`, Retrieves a Contact



### contacts.getListContacts(listId, success) 

Retrieves Contacts from a Contact List

**Parameters**

**listId**: `string`, Retrieves Contacts from a Contact List

**success**: `responseSuccess`, Retrieves Contacts from a Contact List



### contacts.addContact(contact, success) 

Adds a Contact to a Contact List

**Parameters**

**contact**: `contact`, Adds a Contact to a Contact List

**success**: `responseSuccess`, Adds a Contact to a Contact List



### contacts.bulkAddContacts(opts, success) 

Adds a batch of Contacts

**Parameters**

**opts**: `object`, Adds a batch of Contacts

**success**: `responseSuccess`, Adds a batch of Contacts



### contacts.updateContact(opts, success) 

fds

**Parameters**

**opts**: `object`, fds

**success**: `responseSuccess`, fds



### contacts.getImportAddressesByType(opts, success) 

Retrieves an Import Address by a Type

**Parameters**

**opts**: , Retrieves an Import Address by a Type

**success**: `responseSuccess`, Retrieves an Import Address by a Type



### contacts.addContactImportAddress(opts, success) 

Retrieves an Import Address by a Type

**Parameters**

**opts**: `object`, Retrieves an Import Address by a Type

**success**: `responseSuccess`, Retrieves an Import Address by a Type



### contacts.getClientRecentInteractions(opts, success) 

Retrieves a list of re

**Parameters**

**opts**: `getClientInteractionOptions`, Retrieves a list of re

**success**: `responseSuccess`, Retrieves a list of re



### contacts.getEmails(success) 

Retrieves a list of Emails from the current authenticated session

**Parameters**

**success**: `responseSuccess`, Retrieves a list of Emails from the current authenticated session



### contacts.sendCustomVideoEmail(opts, success) 

fds

**Parameters**

**opts**: `customVideoEmailOptions`, fds

**success**: `responseSuccess`, fds



### contacts.getDrips(opts, success) 

fds

**Parameters**

**opts**: `object`, fds

**success**: `responseSuccess`, fds



### contacts.getForms(opts, success) 

fds

**Parameters**

**opts**: `object`, fds

**success**: `responseSuccess`, fds



### contacts.deleteVideo(videoId, success) 

Deletes a Video

**Parameters**

**videoId**: `string`, Deletes a Video

**success**: `responseSuccess`, Deletes a Video



### contacts.videoQuickSend(opts, pcall) 

fds

**Parameters**

**opts**: , fds

**pcall**: , fds




* * *










