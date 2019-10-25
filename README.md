# BBCore

[![Build Status](https://travis-ci.org/bombbomb/BBCore.svg?branch=master)](https://travis-ci.org/bombbomb/BBCore) [![Code Climate](https://codeclimate.com/github/bombbomb/BBCore/badges/gpa.svg)](https://codeclimate.com/github/bombbomb/BBCore) [![Test Coverage](https://codeclimate.com/github/bombbomb/BBCore/badges/coverage.svg)](https://codeclimate.com/github/bombbomb/BBCore)

BombBomb makes it easy to build relationships with simple videos. Use this JavaScript API to record a video on your website, email it within a clean, beautiful design, and receive detailed analytics on opens, click and plays. With the free BombBomb app you can receive push notifications and respond right away when someone interacts with your email.

## Quick Start

To begin, include the `BBCore` and `jQuery` libraries in your html (The latest version is available at `https://static.bombbomb.com/js/BBCore.min.js`):

```html
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
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
[BombBomb's Webhooks](https://support.bombbomb.com/hc/en-us/articles/115000439932-How-do-I-set-up-BombBomb-webhooks) make
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


## Classes

<dl>
<dt><a href="#contacts">contacts</a></dt>
<dd></dd>
<dt><a href="#BBCore">BBCore</a></dt>
<dd></dd>
<dt><a href="#videoOptions">videoOptions</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#BBCore">BBCore</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#responseSuccess">responseSuccess(responseObject, jqXHR)</a></dt>
<dd><p>reponseSuccess</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#responseSuccess">responseSuccess</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#responseObject">responseObject</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#OAuthClientCredentials">OAuthClientCredentials</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#responseSuccess">responseSuccess</a> : <code>function</code></dt>
<dd><p>This callback is displayed as a global member.</p>
</dd>
<dt><a href="#requestParameters">requestParameters</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#getClientInteractionOptions">getClientInteractionOptions</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#customVideoEmailOptions">customVideoEmailOptions</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#responseSuccess">responseSuccess</a> : <code>function</code></dt>
<dd><p>This callback is displayed as a global member.</p>
</dd>
<dt><a href="#contactProperties">contactProperties</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#videoProperties">videoProperties</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="contacts"></a>

## contacts
**Kind**: global class  

* [contacts](#contacts)
    * [.add(contact)](#contacts+add) ⇒ <code>[contacts](#contacts)</code>
    * [.find(fieldName, value)](#contacts+find) ⇒ <code>\*</code> &#124; <code>[contact](#BBCore.contact)</code>

<a name="contacts+add"></a>

### contacts.add(contact) ⇒ <code>[contacts](#contacts)</code>
Adds a Contact [contact](#BBCore.contact) to Contacts collection

**Kind**: instance method of <code>[contacts](#contacts)</code>  

| Param | Type |
| --- | --- |
| contact | <code>contact</code> | 

<a name="contacts+find"></a>

### contacts.find(fieldName, value) ⇒ <code>\*</code> &#124; <code>[contact](#BBCore.contact)</code>
Returns the first matched contact from

**Kind**: instance method of <code>[contacts](#contacts)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fieldName | <code>string</code> | Name of the field to search for the value |
| value | <code>string</code> | Value to search for in the contacts |

<a name="BBCore"></a>

## BBCore
**Kind**: global class  

* [BBCore](#BBCore)
    * _instance_
        * [.resumeStoredSession](#BBCore+resumeStoredSession)
        * [.getServerUrl()](#BBCore+getServerUrl) ⇒ <code>BBCore.apiServer</code> &#124; <code>\*</code> &#124; <code>BBCore.CONFIG.SERVER_API_URL</code>
        * [.getRequestUrl()](#BBCore+getRequestUrl) ⇒ <code>string</code>
        * [.sendRequest(method, [params], [success], [error])](#BBCore+sendRequest)
        * [.login(uid, pwd, success)](#BBCore+login)
        * [.credentialsSaved()](#BBCore+credentialsSaved) ⇒ <code>boolean</code>
        * [.saveCredentials(uid, pwd)](#BBCore+saveCredentials)
        * [.validateSession(onSuccess, onError)](#BBCore+validateSession)
        * [.validateAccessToken(onSuccess)](#BBCore+validateAccessToken)
        * [.isAuthenticated()](#BBCore+isAuthenticated) ⇒ <code>boolean</code> &#124; <code>\*</code>
        * [.invalidateSession()](#BBCore+invalidateSession) ⇒ <code>boolean</code> &#124; <code>\*</code>
        * [.verifyKey(key, complete)](#BBCore+verifyKey)
        * [.storeKey(key)](#BBCore+storeKey)
        * [.verifyJsonWebToken(key, complete)](#BBCore+verifyJsonWebToken)
        * [.storeOAuthTokens(key)](#BBCore+storeOAuthTokens)
        * [.getOAuthPayload()](#BBCore+getOAuthPayload) ⇒ <code>string</code>
        * [.validateOAuthCode(authCode, onSuccess, onError)](#BBCore+validateOAuthCode)
        * [.refreshOAuthToken()](#BBCore+refreshOAuthToken)
        * [.storeJsonWebToken(key)](#BBCore+storeJsonWebToken)
        * [.getValidJsonWebTokenAsync(callback)](#BBCore+getValidJsonWebTokenAsync)
        * [.getLists(success)](#BBCore+getLists)
        * [.createList(listName, success)](#BBCore+createList)
        * [.getContact(contactId, success)](#BBCore+getContact)
        * [.getListContacts(listId, success)](#BBCore+getListContacts)
        * [.addContact(contact, success)](#BBCore+addContact)
        * [.bulkAddContacts(opts, success)](#BBCore+bulkAddContacts)
        * [.updateContact(opts, success)](#BBCore+updateContact)
        * [.getImportAddressesByType(opts, success)](#BBCore+getImportAddressesByType)
        * [.addContactImportAddress(opts, success)](#BBCore+addContactImportAddress)
        * [.getClientRecentInteractions(opts, success)](#BBCore+getClientRecentInteractions)
        * [.getEmails(success)](#BBCore+getEmails)
        * [.sendCustomVideoEmail(opts, success)](#BBCore+sendCustomVideoEmail)
        * [.getDrips(opts, success)](#BBCore+getDrips)
        * [.getForms(opts, success)](#BBCore+getForms)
        * [.getClientIntegrations(opts, success)](#BBCore+getClientIntegrations)
        * [.deleteVideo(videoId, success)](#BBCore+deleteVideo)
        * [.videoQuickSend(opts, onSuccess)](#BBCore+videoQuickSend)
        * [.getEmbeddedRecorderUrl([options], onComplete)](#BBCore+getEmbeddedRecorderUrl)
        * [.getVideoRecorder(opts, onComplete)](#BBCore+getVideoRecorder)
        * [.saveRecordedVideo(title, videoId, videoFilename, success)](#BBCore+saveRecordedVideo)
        * [.saveRecording(options)](#BBCore+saveRecording)
    * _static_
        * [.video](#BBCore.video)
            * [new video(properties)](#new_BBCore.video_new)
        * [.contact](#BBCore.contact)
            * [new contact(properties)](#new_BBCore.contact_new)
        * [.video](#BBCore.video)
            * [new video(properties)](#new_BBCore.video_new)
        * [.CONFIG](#BBCore.CONFIG) : <code>Object</code>

<a name="BBCore+resumeStoredSession"></a>

### bbCore.resumeStoredSession
DEPRECATED - Use validateSession

**Kind**: instance property of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+getServerUrl"></a>

### bbCore.getServerUrl() ⇒ <code>BBCore.apiServer</code> &#124; <code>\*</code> &#124; <code>BBCore.CONFIG.SERVER_API_URL</code>
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+getRequestUrl"></a>

### bbCore.getRequestUrl() ⇒ <code>string</code>
Returns the fully qualified URL for BB API

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+sendRequest"></a>

### bbCore.sendRequest(method, [params], [success], [error])
Sends a request to the specified method of the [BombBomb API](//bombbomb.com/api)

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The method name to call |
| [params] | <code>[requestParameters](#requestParameters)</code> | The parameters to send with the request |
| [success] | <code>[responseSuccess](#responseSuccess)</code> | A callback when the request succeeds |
| [error] | <code>[responseSuccess](#responseSuccess)</code> | A callback when the request fails |

<a name="BBCore+login"></a>

### bbCore.login(uid, pwd, success)
Authenticates a user using their Email Address (User Id) and Password

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| uid | <code>string</code> | 
| pwd | <code>string</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+credentialsSaved"></a>

### bbCore.credentialsSaved() ⇒ <code>boolean</code>
Returns bool for whether or not a prior authentication is stored locally

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+saveCredentials"></a>

### bbCore.saveCredentials(uid, pwd)
Save credentials to local storage (not recommended)

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>string</code> | User ID/Email Address |
| pwd | <code>string</code> | Password |

<a name="BBCore+validateSession"></a>

### bbCore.validateSession(onSuccess, onError)
Authenticates from previously stored credentials

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| onSuccess | <code>[responseSuccess](#responseSuccess)</code> | 
| onError | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+validateAccessToken"></a>

### bbCore.validateAccessToken(onSuccess)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| onSuccess | 

<a name="BBCore+isAuthenticated"></a>

### bbCore.isAuthenticated() ⇒ <code>boolean</code> &#124; <code>\*</code>
Returns bool for authentication state

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+invalidateSession"></a>

### bbCore.invalidateSession() ⇒ <code>boolean</code> &#124; <code>\*</code>
Invalidates and clears the active session, similar to logout

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+verifyKey"></a>

### bbCore.verifyKey(key, complete)
Validates the given key

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| complete | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+storeKey"></a>

### bbCore.storeKey(key)
Stores the give session key, typically used so a session can be resumed later on.

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| key | 

<a name="BBCore+verifyJsonWebToken"></a>

### bbCore.verifyJsonWebToken(key, complete)
Validates the given key

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| complete | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+storeOAuthTokens"></a>

### bbCore.storeOAuthTokens(key)
Stores the OAuth Token for API calls

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| key | 

<a name="BBCore+getOAuthPayload"></a>

### bbCore.getOAuthPayload() ⇒ <code>string</code>
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+validateOAuthCode"></a>

### bbCore.validateOAuthCode(authCode, onSuccess, onError)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| authCode | 
| onSuccess | 
| onError | 

<a name="BBCore+refreshOAuthToken"></a>

### bbCore.refreshOAuthToken()
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+storeJsonWebToken"></a>

### bbCore.storeJsonWebToken(key)
Stores the give session key, typically used so a session can be resumed later on.

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| key | 

<a name="BBCore+getValidJsonWebTokenAsync"></a>

### bbCore.getValidJsonWebTokenAsync(callback)
Attempts to always return a valid JWT which makes an async verification request

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Description |
| --- | --- |
| callback | handler given a valid JWT.  If the JWT is null then the user is NOT authenticated. |

<a name="BBCore+getLists"></a>

### bbCore.getLists(success)
Retrieves Contact Lists

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+createList"></a>

### bbCore.createList(listName, success)
Creates a Contact List and returns the Guid

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| listName | <code>string</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getContact"></a>

### bbCore.getContact(contactId, success)
Retrieves a Contact

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| contactId | <code>string</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getListContacts"></a>

### bbCore.getListContacts(listId, success)
Retrieves Contacts from a Contact List

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| listId | <code>string</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+addContact"></a>

### bbCore.addContact(contact, success)
Adds a Contact to a Contact List

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| contact | <code>contact</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+bulkAddContacts"></a>

### bbCore.bulkAddContacts(opts, success)
Adds a batch of Contacts

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+updateContact"></a>

### bbCore.updateContact(opts, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getImportAddressesByType"></a>

### bbCore.getImportAddressesByType(opts, success)
Retrieves an Import Address by a Type

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts |  | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+addContactImportAddress"></a>

### bbCore.addContactImportAddress(opts, success)
Retrieves an Import Address by a Type

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getClientRecentInteractions"></a>

### bbCore.getClientRecentInteractions(opts, success)
Retrieves a list of re

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>[getClientInteractionOptions](#getClientInteractionOptions)</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getEmails"></a>

### bbCore.getEmails(success)
Retrieves a list of Emails from the current authenticated session

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+sendCustomVideoEmail"></a>

### bbCore.sendCustomVideoEmail(opts, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>[customVideoEmailOptions](#customVideoEmailOptions)</code> | 
| success | <code>function</code> | 

<a name="BBCore+getDrips"></a>

### bbCore.getDrips(opts, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getForms"></a>

### bbCore.getForms(opts, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getClientIntegrations"></a>

### bbCore.getClientIntegrations(opts, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| opts | 
| success | 

<a name="BBCore+deleteVideo"></a>

### bbCore.deleteVideo(videoId, success)
Deletes a Video

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| videoId | <code>string</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+videoQuickSend"></a>

### bbCore.videoQuickSend(opts, onSuccess)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| onSuccess | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getEmbeddedRecorderUrl"></a>

### bbCore.getEmbeddedRecorderUrl([options], onComplete)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| [options] | <code>Object</code> | 
| onComplete | <code>function</code> | 

<a name="BBCore+getVideoRecorder"></a>

### bbCore.getVideoRecorder(opts, onComplete)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| onComplete | <code>function</code> | 

<a name="BBCore+saveRecordedVideo"></a>

### bbCore.saveRecordedVideo(title, videoId, videoFilename, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| title | <code>string</code> | 
| videoId | <code>string</code> | 
| videoFilename | <code>string</code> | 
| success | <code>function</code> | 

<a name="BBCore+saveRecording"></a>

### bbCore.saveRecording(options)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="BBCore.video"></a>

### BBCore.video
{Object} BBCore.videos

**Kind**: static class of <code>[BBCore](#BBCore)</code>  
<a name="new_BBCore.video_new"></a>

#### new video(properties)

| Param | Type |
| --- | --- |
| properties | <code>[videoProperties](#videoProperties)</code> | 

<a name="BBCore.contact"></a>

### BBCore.contact
stuff

**Kind**: static class of <code>[BBCore](#BBCore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | Email Address |
| firstname | <code>string</code> | First Name |
| lastname | <code>string</code> | Last Name |
| phone_number | <code>string</code> | Phone Number |
| address_line_1 | <code>string</code> | Address 1 |
| address_line_2 | <code>string</code> | Address 2 |
| city | <code>string</code> | City |
| state | <code>string</code> | State |
| country | <code>string</code> | Country` |
| postal_code | <code>string</code> | Postal Code |
| company | <code>string</code> | Company |
| position | <code>string</code> | Position |
| comments | <code>string</code> | Comments |
| listlist | <code>string</code> | Array of List Ids the Contact is subscribed to |
| id | <code>string</code> | Contact Id |

<a name="new_BBCore.contact_new"></a>

#### new contact(properties)
Contact Object


| Param | Type | Description |
| --- | --- | --- |
| properties | <code>[contactProperties](#contactProperties)</code> | [contactProperties](#contactProperties) |

<a name="BBCore.video"></a>

### BBCore.video
BBCore.video

**Kind**: static class of <code>[BBCore](#BBCore)</code>  
**Properties**

| Name | Type |
| --- | --- |
| vid_id | <code>string</code> | 
| title | <code>string</code> | 
| filename | <code>string</code> | 

<a name="new_BBCore.video_new"></a>

#### new video(properties)

| Param | Type |
| --- | --- |
| properties | <code>[videoProperties](#videoProperties)</code> | 

<a name="BBCore.CONFIG"></a>

### BBCore.CONFIG : <code>Object</code>
**Kind**: static constant of <code>[BBCore](#BBCore)</code>  
**Properties**

| Name |
| --- |
| VERSION | 
| API_END_POINT | 
| SERVER_API_URL | 

<a name="videoOptions"></a>

## videoOptions
**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| vid_id | <code>string</code> | 

<a name="BBCore"></a>

## BBCore : <code>object</code>
**Kind**: global namespace  

* [BBCore](#BBCore) : <code>object</code>
    * _instance_
        * [.resumeStoredSession](#BBCore+resumeStoredSession)
        * [.getServerUrl()](#BBCore+getServerUrl) ⇒ <code>BBCore.apiServer</code> &#124; <code>\*</code> &#124; <code>BBCore.CONFIG.SERVER_API_URL</code>
        * [.getRequestUrl()](#BBCore+getRequestUrl) ⇒ <code>string</code>
        * [.sendRequest(method, [params], [success], [error])](#BBCore+sendRequest)
        * [.login(uid, pwd, success)](#BBCore+login)
        * [.credentialsSaved()](#BBCore+credentialsSaved) ⇒ <code>boolean</code>
        * [.saveCredentials(uid, pwd)](#BBCore+saveCredentials)
        * [.validateSession(onSuccess, onError)](#BBCore+validateSession)
        * [.validateAccessToken(onSuccess)](#BBCore+validateAccessToken)
        * [.isAuthenticated()](#BBCore+isAuthenticated) ⇒ <code>boolean</code> &#124; <code>\*</code>
        * [.invalidateSession()](#BBCore+invalidateSession) ⇒ <code>boolean</code> &#124; <code>\*</code>
        * [.verifyKey(key, complete)](#BBCore+verifyKey)
        * [.storeKey(key)](#BBCore+storeKey)
        * [.verifyJsonWebToken(key, complete)](#BBCore+verifyJsonWebToken)
        * [.storeOAuthTokens(key)](#BBCore+storeOAuthTokens)
        * [.getOAuthPayload()](#BBCore+getOAuthPayload) ⇒ <code>string</code>
        * [.validateOAuthCode(authCode, onSuccess, onError)](#BBCore+validateOAuthCode)
        * [.refreshOAuthToken()](#BBCore+refreshOAuthToken)
        * [.storeJsonWebToken(key)](#BBCore+storeJsonWebToken)
        * [.getValidJsonWebTokenAsync(callback)](#BBCore+getValidJsonWebTokenAsync)
        * [.getLists(success)](#BBCore+getLists)
        * [.createList(listName, success)](#BBCore+createList)
        * [.getContact(contactId, success)](#BBCore+getContact)
        * [.getListContacts(listId, success)](#BBCore+getListContacts)
        * [.addContact(contact, success)](#BBCore+addContact)
        * [.bulkAddContacts(opts, success)](#BBCore+bulkAddContacts)
        * [.updateContact(opts, success)](#BBCore+updateContact)
        * [.getImportAddressesByType(opts, success)](#BBCore+getImportAddressesByType)
        * [.addContactImportAddress(opts, success)](#BBCore+addContactImportAddress)
        * [.getClientRecentInteractions(opts, success)](#BBCore+getClientRecentInteractions)
        * [.getEmails(success)](#BBCore+getEmails)
        * [.sendCustomVideoEmail(opts, success)](#BBCore+sendCustomVideoEmail)
        * [.getDrips(opts, success)](#BBCore+getDrips)
        * [.getForms(opts, success)](#BBCore+getForms)
        * [.getClientIntegrations(opts, success)](#BBCore+getClientIntegrations)
        * [.deleteVideo(videoId, success)](#BBCore+deleteVideo)
        * [.videoQuickSend(opts, onSuccess)](#BBCore+videoQuickSend)
        * [.getEmbeddedRecorderUrl([options], onComplete)](#BBCore+getEmbeddedRecorderUrl)
        * [.getVideoRecorder(opts, onComplete)](#BBCore+getVideoRecorder)
        * [.saveRecordedVideo(title, videoId, videoFilename, success)](#BBCore+saveRecordedVideo)
        * [.saveRecording(options)](#BBCore+saveRecording)
    * _static_
        * [.video](#BBCore.video)
            * [new video(properties)](#new_BBCore.video_new)
        * [.contact](#BBCore.contact)
            * [new contact(properties)](#new_BBCore.contact_new)
        * [.video](#BBCore.video)
            * [new video(properties)](#new_BBCore.video_new)
        * [.CONFIG](#BBCore.CONFIG) : <code>Object</code>

<a name="BBCore+resumeStoredSession"></a>

### bbCore.resumeStoredSession
DEPRECATED - Use validateSession

**Kind**: instance property of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+getServerUrl"></a>

### bbCore.getServerUrl() ⇒ <code>BBCore.apiServer</code> &#124; <code>\*</code> &#124; <code>BBCore.CONFIG.SERVER_API_URL</code>
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+getRequestUrl"></a>

### bbCore.getRequestUrl() ⇒ <code>string</code>
Returns the fully qualified URL for BB API

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+sendRequest"></a>

### bbCore.sendRequest(method, [params], [success], [error])
Sends a request to the specified method of the [BombBomb API](//bombbomb.com/api)

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The method name to call |
| [params] | <code>[requestParameters](#requestParameters)</code> | The parameters to send with the request |
| [success] | <code>[responseSuccess](#responseSuccess)</code> | A callback when the request succeeds |
| [error] | <code>[responseSuccess](#responseSuccess)</code> | A callback when the request fails |

<a name="BBCore+login"></a>

### bbCore.login(uid, pwd, success)
Authenticates a user using their Email Address (User Id) and Password

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| uid | <code>string</code> | 
| pwd | <code>string</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+credentialsSaved"></a>

### bbCore.credentialsSaved() ⇒ <code>boolean</code>
Returns bool for whether or not a prior authentication is stored locally

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+saveCredentials"></a>

### bbCore.saveCredentials(uid, pwd)
Save credentials to local storage (not recommended)

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>string</code> | User ID/Email Address |
| pwd | <code>string</code> | Password |

<a name="BBCore+validateSession"></a>

### bbCore.validateSession(onSuccess, onError)
Authenticates from previously stored credentials

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| onSuccess | <code>[responseSuccess](#responseSuccess)</code> | 
| onError | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+validateAccessToken"></a>

### bbCore.validateAccessToken(onSuccess)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| onSuccess | 

<a name="BBCore+isAuthenticated"></a>

### bbCore.isAuthenticated() ⇒ <code>boolean</code> &#124; <code>\*</code>
Returns bool for authentication state

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+invalidateSession"></a>

### bbCore.invalidateSession() ⇒ <code>boolean</code> &#124; <code>\*</code>
Invalidates and clears the active session, similar to logout

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+verifyKey"></a>

### bbCore.verifyKey(key, complete)
Validates the given key

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| complete | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+storeKey"></a>

### bbCore.storeKey(key)
Stores the give session key, typically used so a session can be resumed later on.

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| key | 

<a name="BBCore+verifyJsonWebToken"></a>

### bbCore.verifyJsonWebToken(key, complete)
Validates the given key

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| complete | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+storeOAuthTokens"></a>

### bbCore.storeOAuthTokens(key)
Stores the OAuth Token for API calls

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| key | 

<a name="BBCore+getOAuthPayload"></a>

### bbCore.getOAuthPayload() ⇒ <code>string</code>
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+validateOAuthCode"></a>

### bbCore.validateOAuthCode(authCode, onSuccess, onError)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| authCode | 
| onSuccess | 
| onError | 

<a name="BBCore+refreshOAuthToken"></a>

### bbCore.refreshOAuthToken()
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  
<a name="BBCore+storeJsonWebToken"></a>

### bbCore.storeJsonWebToken(key)
Stores the give session key, typically used so a session can be resumed later on.

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| key | 

<a name="BBCore+getValidJsonWebTokenAsync"></a>

### bbCore.getValidJsonWebTokenAsync(callback)
Attempts to always return a valid JWT which makes an async verification request

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Description |
| --- | --- |
| callback | handler given a valid JWT.  If the JWT is null then the user is NOT authenticated. |

<a name="BBCore+getLists"></a>

### bbCore.getLists(success)
Retrieves Contact Lists

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+createList"></a>

### bbCore.createList(listName, success)
Creates a Contact List and returns the Guid

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| listName | <code>string</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getContact"></a>

### bbCore.getContact(contactId, success)
Retrieves a Contact

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| contactId | <code>string</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getListContacts"></a>

### bbCore.getListContacts(listId, success)
Retrieves Contacts from a Contact List

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| listId | <code>string</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+addContact"></a>

### bbCore.addContact(contact, success)
Adds a Contact to a Contact List

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| contact | <code>contact</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+bulkAddContacts"></a>

### bbCore.bulkAddContacts(opts, success)
Adds a batch of Contacts

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+updateContact"></a>

### bbCore.updateContact(opts, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getImportAddressesByType"></a>

### bbCore.getImportAddressesByType(opts, success)
Retrieves an Import Address by a Type

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts |  | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+addContactImportAddress"></a>

### bbCore.addContactImportAddress(opts, success)
Retrieves an Import Address by a Type

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getClientRecentInteractions"></a>

### bbCore.getClientRecentInteractions(opts, success)
Retrieves a list of re

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>[getClientInteractionOptions](#getClientInteractionOptions)</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getEmails"></a>

### bbCore.getEmails(success)
Retrieves a list of Emails from the current authenticated session

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+sendCustomVideoEmail"></a>

### bbCore.sendCustomVideoEmail(opts, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>[customVideoEmailOptions](#customVideoEmailOptions)</code> | 
| success | <code>function</code> | 

<a name="BBCore+getDrips"></a>

### bbCore.getDrips(opts, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getForms"></a>

### bbCore.getForms(opts, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getClientIntegrations"></a>

### bbCore.getClientIntegrations(opts, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param |
| --- |
| opts | 
| success | 

<a name="BBCore+deleteVideo"></a>

### bbCore.deleteVideo(videoId, success)
Deletes a Video

**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| videoId | <code>string</code> | 
| success | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+videoQuickSend"></a>

### bbCore.videoQuickSend(opts, onSuccess)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| onSuccess | <code>[responseSuccess](#responseSuccess)</code> | 

<a name="BBCore+getEmbeddedRecorderUrl"></a>

### bbCore.getEmbeddedRecorderUrl([options], onComplete)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| [options] | <code>Object</code> | 
| onComplete | <code>function</code> | 

<a name="BBCore+getVideoRecorder"></a>

### bbCore.getVideoRecorder(opts, onComplete)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| onComplete | <code>function</code> | 

<a name="BBCore+saveRecordedVideo"></a>

### bbCore.saveRecordedVideo(title, videoId, videoFilename, success)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| title | <code>string</code> | 
| videoId | <code>string</code> | 
| videoFilename | <code>string</code> | 
| success | <code>function</code> | 

<a name="BBCore+saveRecording"></a>

### bbCore.saveRecording(options)
**Kind**: instance method of <code>[BBCore](#BBCore)</code>  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="BBCore.video"></a>

### BBCore.video
{Object} BBCore.videos

**Kind**: static class of <code>[BBCore](#BBCore)</code>  
<a name="new_BBCore.video_new"></a>

#### new video(properties)

| Param | Type |
| --- | --- |
| properties | <code>[videoProperties](#videoProperties)</code> | 

<a name="BBCore.contact"></a>

### BBCore.contact
stuff

**Kind**: static class of <code>[BBCore](#BBCore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | Email Address |
| firstname | <code>string</code> | First Name |
| lastname | <code>string</code> | Last Name |
| phone_number | <code>string</code> | Phone Number |
| address_line_1 | <code>string</code> | Address 1 |
| address_line_2 | <code>string</code> | Address 2 |
| city | <code>string</code> | City |
| state | <code>string</code> | State |
| country | <code>string</code> | Country` |
| postal_code | <code>string</code> | Postal Code |
| company | <code>string</code> | Company |
| position | <code>string</code> | Position |
| comments | <code>string</code> | Comments |
| listlist | <code>string</code> | Array of List Ids the Contact is subscribed to |
| id | <code>string</code> | Contact Id |

<a name="new_BBCore.contact_new"></a>

#### new contact(properties)
Contact Object


| Param | Type | Description |
| --- | --- | --- |
| properties | <code>[contactProperties](#contactProperties)</code> | [contactProperties](#contactProperties) |

<a name="BBCore.video"></a>

### BBCore.video
BBCore.video

**Kind**: static class of <code>[BBCore](#BBCore)</code>  
**Properties**

| Name | Type |
| --- | --- |
| vid_id | <code>string</code> | 
| title | <code>string</code> | 
| filename | <code>string</code> | 

<a name="new_BBCore.video_new"></a>

#### new video(properties)

| Param | Type |
| --- | --- |
| properties | <code>[videoProperties](#videoProperties)</code> | 

<a name="BBCore.CONFIG"></a>

### BBCore.CONFIG : <code>Object</code>
**Kind**: static constant of <code>[BBCore](#BBCore)</code>  
**Properties**

| Name |
| --- |
| VERSION | 
| API_END_POINT | 
| SERVER_API_URL | 

<a name="responseSuccess"></a>

## responseSuccess(responseObject, jqXHR)
reponseSuccess

**Kind**: global function  

| Param |
| --- |
| responseObject | 
| jqXHR | 

<a name="responseSuccess"></a>

## responseSuccess : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| status | <code>string</code> | 
| method | <code>string</code> | 
| info | <code>Object</code> | 

<a name="responseObject"></a>

## responseObject : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| status | <code>string</code> | 
| method | <code>string</code> | 
| info | <code>Object</code> | 

<a name="OAuthClientCredentials"></a>

## OAuthClientCredentials : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| clientIdentifier | <code>string</code> |  |
| clientSecret | <code>string</code> |  |
| redirectUri | <code>string</code> |  |
| type | <code>string</code> | 'implicit' | 'authorization_code' |

<a name="responseSuccess"></a>

## responseSuccess : <code>function</code>
This callback is displayed as a global member.

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| responseObject | <code>Object</code> | 
| [jqXHR] | <code>Object</code> | 

<a name="requestParameters"></a>

## requestParameters : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| method | <code>string</code> | 
| api_key | <code>string</code> | 
| async | <code>string</code> | 
| url | <code>string</code> | 
| url | <code>string</code> | 

<a name="getClientInteractionOptions"></a>

## getClientInteractionOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| activitySince | <code>string</code> | DateTime |

<a name="customVideoEmailOptions"></a>

## customVideoEmailOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| from_name | <code>string</code> | 
| email_id | <code>string</code> | 
| email | <code>string</code> | 
| subject | <code>string</code> | 
| html_content | <code>string</code> | 

<a name="responseSuccess"></a>

## responseSuccess : <code>function</code>
This callback is displayed as a global member.

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| responseObject | <code>Object</code> | 
| [jqXHR] | <code>Object</code> | 

<a name="contactProperties"></a>

## contactProperties : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | Email Address |
| firstname | <code>string</code> | First Name |
| lastname | <code>string</code> | Last Name |
| phone_number | <code>string</code> | Phone Number |
| address_line_1 | <code>string</code> | Address 1 |
| address_line_2 | <code>string</code> | Address 2 |
| city | <code>string</code> | City |
| state | <code>string</code> | State |
| country | <code>string</code> | Country` |
| postal_code | <code>string</code> | Postal Code |
| company | <code>string</code> | Company |
| position | <code>string</code> | Position |
| comments | <code>string</code> | Comments |
| listlist | <code>string</code> | Array of List Ids the Contact is subscribed to |
| id | <code>string</code> | Contact Id |

<a name="videoProperties"></a>

## videoProperties : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| vid_id | <code>string</code> | 
| title | <code>string</code> | 
| filename | <code>string</code> | 

