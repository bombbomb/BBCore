//
// BBCore Video Tests
//
var apiServerUri = 'http://dev.app.bombbomb.com/app/api/api.php';
var testGuid = '11111111-1111-1111-1111-111111111111';

function simulateAuthenticatedApi(bbCore) {
    // This is only simulate a successful api call to login.  DO NOT do this in your implementation
    bbCore.authenticated = true;
}

function setupMockApiRequest(result, error) {
    spyOn($, 'ajax').and.callFake(function (e) {
        if (error) {
            e.error(result);
        }
        else {
            e.success(result);
        }
    });
}

describe("BBCore.api", function() {
    var successCallbackSpy = null;
    var bbCore = new BBCore({ access_id: 'invalid-token', apiServer: apiServerUri });
    bbCore.logout();

    var result = {
        responseSuccess: {"status":"success","methodName":"GetVideos","info":[{"id":testGuid,"name":"Video Title","description":"Video Description","status":"1","thumbUrl":"thumbnailUrl","shortUrl":"shortUrl","height":"480","width":"640","created":"2\/06\/15 10:33:05 am","vidUrl":"videoDeliveryUrl"}]},
        responseFailure: { status: 'failure', methodName: 'InvalidSession', info: { errormsg: 'Invalid login' } }
    };

    beforeEach(function() {
        successCallbackSpy = jasmine.createSpy();
        bbCore.onError = jasmine.createSpy();
    });

    it("send unauthenticated request errors", function() {
        setupMockApiRequest(result.responseSuccess);

        bbCore.sendRequest('GetVideos', { video_id: testGuid });

        expect(bbCore.onError).toHaveBeenCalledWith(result.responseFailure, null);
    });

    it("send request", function() {
        simulateAuthenticatedApi(bbCore);
        setupMockApiRequest(result.responseSuccess);

        bbCore.sendRequest('GetVideos', { video_id: testGuid }, successCallbackSpy);

        expect(successCallbackSpy).toHaveBeenCalledWith(result.responseSuccess);
    });

    it("send request with params and callback", function() {
        simulateAuthenticatedApi(bbCore);
        setupMockApiRequest(result.responseSuccess);

        bbCore.sendRequest({ method:  'GetVideos', video_id: testGuid }, successCallbackSpy);

        expect(successCallbackSpy).toHaveBeenCalledWith(result.responseSuccess);
    });

    it("send request synchronous", function() {
        simulateAuthenticatedApi(bbCore);
        setupMockApiRequest(result.responseSuccess);

        bbCore.sendRequest({ method:  'GetVideos', video_id: testGuid, async: false }, successCallbackSpy);

        expect(successCallbackSpy).toHaveBeenCalledWith(result.responseSuccess);
        expect($.ajax.calls.argsFor(0)[0].async).toBe(false);
    });

    it("ajax error", function() {
        var errorParamCallbackSpy = jasmine.createSpy('errorParamCallbackSpy');
        var xhrResult = { responseJSON: { status: "failure" } };

        simulateAuthenticatedApi(bbCore);
        setupMockApiRequest(xhrResult, true);

        bbCore.sendRequest('GetVideos', { video_id: testGuid }, successCallbackSpy, errorParamCallbackSpy);

        expect(bbCore.onError).toHaveBeenCalledWith(xhrResult.responseJSON, xhrResult);
        expect(errorParamCallbackSpy).toHaveBeenCalledWith(bbCore, xhrResult.responseJSON);
        expect(successCallbackSpy).not.toHaveBeenCalled();
    });

    it("ajax error when last response was success", function() {
        var errorParamCallbackSpy = jasmine.createSpy('errorParamCallbackSpy');
        var xhrResult = { responseJSON: { status: "success" } };

        simulateAuthenticatedApi(bbCore);
        setupMockApiRequest(xhrResult, true);

        bbCore.sendRequest('GetVideos', { video_id: testGuid }, successCallbackSpy, errorParamCallbackSpy);

        expect(bbCore.onError).not.toHaveBeenCalled();
        expect(errorParamCallbackSpy).toHaveBeenCalledWith(bbCore, xhrResult.responseJSON);
        expect(successCallbackSpy).toHaveBeenCalledWith(xhrResult.responseJSON, xhrResult);
    });
});

describe("BBCore.auth", function() {

    var bbCore = new BBCore({ access_id: 'invalid-token', apiServer: apiServerUri, storage: window.storage });
    bbCore.logout();

    var successCallbackSpy = null;
    var errorCallbackSpy = null;

    var result = {
        authenticationSuccess: { status: "success", info: { api_key: 'api-key', clientId: 'valid-user', userId: 'valid-user' }},
        authenticationFailure: { status: "failure", methodName: 'BadLogin', info: { errormsg: 'invalid session' } }
    };

    beforeEach(function() {
        successCallbackSpy = jasmine.createSpy();
        errorCallbackSpy = jasmine.createSpy();

        bbCore.onError = errorCallbackSpy;
    });

    it("fail authentication", function () {
        setupMockApiRequest(result.authenticationFailure);

        bbCore.login('badUser', 'badPassword', successCallbackSpy);

        expect(bbCore.isAuthenticated()).toBe(false);
        expect(bbCore.credentialsSaved()).toBe(false);
        expect(successCallbackSpy).not.toHaveBeenCalled();
        expect(errorCallbackSpy).toHaveBeenCalledWith(result.authenticationFailure);
    });

    it("fail authentication without user id", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.login(null);

        expect(bbCore.isAuthenticated()).toBe(false);
        expect(bbCore.credentialsSaved()).toBe(false);
        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("success authentication", function () {
        setupMockApiRequest(result.authenticationSuccess);

        bbCore.login('goodUser', 'goodPassword', successCallbackSpy);

        expect(bbCore.isAuthenticated()).toBe(true);
        expect(bbCore.credentialsSaved()).toBe(true);
        expect(successCallbackSpy).toHaveBeenCalledWith(result.authenticationSuccess);
        expect(errorCallbackSpy).not.toHaveBeenCalled();
    });

    it("success authentication with stored credentials", function() {
        bbCore.saveCredentials('goodUser', 'goodPassword');

        setupMockApiRequest(result.authenticationSuccess);

        bbCore.login(successCallbackSpy);

        expect(bbCore.isAuthenticated()).toBe(true);
        expect(bbCore.credentialsSaved()).toBe(true);
        expect(successCallbackSpy).toHaveBeenCalledWith(result.authenticationSuccess);
        expect(errorCallbackSpy).not.toHaveBeenCalled();
    });

    it("unable to resume stored session", function() {
        bbCore.logout();

        bbCore.resumeStoredSession(successCallbackSpy, errorCallbackSpy);

        expect(successCallbackSpy).not.toHaveBeenCalled();
        expect(errorCallbackSpy).toHaveBeenCalled();
    });

    it("resume stored session from access token", function() {
        spyOn(bbCore, 'validateAccessToken');

        bbCore.storage.setItem("access_token", this.accessToken);   // simulate access token was set.

        bbCore.resumeStoredSession(successCallbackSpy, errorCallbackSpy);

        expect(bbCore.validateAccessToken).toHaveBeenCalledWith(successCallbackSpy);
        expect(errorCallbackSpy).not.toHaveBeenCalled();
    });

    it("resume stored session from username", function() {
        spyOn(bbCore, 'login');

        bbCore.logout();
        bbCore.saveCredentials('username', 'password');

        bbCore.resumeStoredSession(successCallbackSpy, errorCallbackSpy);

        expect(bbCore.login).toHaveBeenCalledWith(successCallbackSpy);
        expect(errorCallbackSpy).not.toHaveBeenCalled();
    });

    it("logout", function() {
        bbCore.logout();

        expect(bbCore.isAuthenticated()).toBe(false);
        expect(bbCore.credentialsSaved()).toBe(false);
    });

    it("validate access token", function() {
        spyOn(bbCore, '__updateSession');
        setupMockApiRequest(result.authenticationSuccess);

        bbCore.validateAccessToken(successCallbackSpy);

        expect(bbCore.__updateSession).toHaveBeenCalledWith(result.authenticationSuccess, successCallbackSpy);
    });

    it("invalidate session", function() {
        spyOn(bbCore, 'sendRequest').and.callThrough();
        setupMockApiRequest({});

        bbCore.invalidateSession();

        expect(bbCore.sendRequest).toHaveBeenCalled();
        expect(bbCore.isAuthenticated()).toBe(false);
    });
});

describe("BBCore.videoRecorder", function() {
    var successCallbackSpy = null;
    var errorCallbackSpy = null;

    var bbCore = new BBCore({ access_id: 'invalid-token', apiServer: apiServerUri, storage: window.storage || [] });

    var result = {
        withOptionsSuccess: { status: "success", info: { user_id: '<Guid>', email: 'test@test.com', client_id: '<Guid>', vid_id: '<Guid>', content: '<Video Recorder Html>', width: 640, height: 480, https: true }},
        withDefaultOptionsSuccess: { status: "success", info: { user_id: '<Guid>', email: 'test@test.com', client_id: '<Guid>', vid_id: '<Guid>', content: '<Video Recorder Html>', width: 340, height: 240, https: false }},
        authenticationFailure: { status: "failure", methodName: 'BadLogin', info: { errormsg: 'invalid session' } }
    };

    beforeEach(function() {
        successCallbackSpy = jasmine.createSpy();
        errorCallbackSpy = jasmine.createSpy();

        bbCore.onError = errorCallbackSpy;
    });

    it("getVideoRecorder: error when unauthenticated", function() {
        expect(bbCore.isAuthenticated()).toBe(false);

        bbCore.getVideoRecorder();

        expect(errorCallbackSpy).toHaveBeenCalled();
    });

    it("getVideoRecorder: with options", function() {
        var opts = { height: 480, width: 640, force_ssl: true, start: null, stop: null, recorded: null };

        bbCore.authenticated = true; // simulate being logged in

        spyOn($, 'ajax').and.callFake(function(e) {
            e.success(result.withOptionsSuccess);
        });

        bbCore.getVideoRecorder(opts, successCallbackSpy);

        expect($.ajax.calls.argsFor(0)[0].data).toEqual(opts);
        expect(successCallbackSpy).toHaveBeenCalledWith(result.withOptionsSuccess);
    });

    it("getVideoRecorder: without options", function() {
        var defaultOptions = { height: 240, width: 340, force_ssl: false, start: null, stop: null, recorded: null, method : 'GetVideoRecorder', api_key : '' };

        bbCore.authenticated = true;    // simulate being logged in

        spyOn($, 'ajax').and.callFake(function(e) {
            e.success(result.withDefaultOptionsSuccess);
        });

        bbCore.getVideoRecorder(successCallbackSpy);

        expect($.ajax.calls.argsFor(0)[0].data).toEqual(defaultOptions);
        expect(successCallbackSpy).toHaveBeenCalledWith(result.withDefaultOptionsSuccess);
    });
});

describe("BBCore.video", function() {

    var bbCore = new BBCore({ access_id: 'test', apiServer: apiServerUri });

    it("getVideo: authentication fails", function() {
        var validVideoId = '11111111-1111-1111-1111-111111111111';
        var successCallback = jasmine.createSpy();
        var result = { status: "success", info: { video_id: validVideoId }};

        spyOn($, 'ajax').and.callFake(function(e) {
            e.success(result);
        });

        bbCore.getVideo(validVideoId, successCallback);

        expect(successCallback).not.toHaveBeenCalled();
    });

    it("getVideo: exists with a valid id", function() {
        var validVideoId = '11111111-1111-1111-1111-111111111111';
        var successCallback = jasmine.createSpy();
        var result = { status: "success", info: { video_id: validVideoId }};

        bbCore.authenticated = true;    // simulate being logged in

        spyOn($, 'ajax').and.callFake(function(e) {
            e.success(result);
        });

        bbCore.getVideo(validVideoId, successCallback);

        expect(successCallback).toHaveBeenCalledWith(result);
    });

    it("doesn't exist for an invalid id", function() {
        var invalidVideoId = 'invalid video id';
        var successCallback = jasmine.createSpy();
        var result = { status: "failure", info: "error"};

        spyOn($, 'ajax').and.callFake(function(e) {
            e.success(result);
        });

        BBCore.prototype.getVideo(invalidVideoId, successCallback);

        expect(successCallback.calls.count()).toEqual(0);
    });

    it("isn't requested without a valid video id", function() {
        spyOn($, 'ajax');

        BBCore.prototype.getVideo(null, 'callback ignored');

        expect($.ajax.calls.count()).toEqual(0);
    });

    it("isn't requested without a valid video id", function() {
        spyOn($, 'ajax');

        BBCore.prototype.getVideo(null, 'callback ignored');

        expect($.ajax.calls.count()).toEqual(0);
    });

});

describe("BBCore.contacts", function() {
    var successCallbackSpy = null;
    var bbCore = new BBCore({ access_id: 'token', apiServer: apiServerUri });

    beforeEach(function() {
        simulateAuthenticatedApi(bbCore);

        successCallbackSpy = jasmine.createSpy();

        spyOn(bbCore, 'sendRequest');
    });

    it("get lists", function() {
        bbCore.getLists(successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith({method: "GetLists"}, successCallbackSpy);
    });

    it("create list", function() {
        var listName = 'Test List';

        bbCore.createList(listName, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith({method: "createList", name: listName}, successCallbackSpy);
    });

    it("get contact", function() {
        var contactId = testGuid;

        bbCore.getContact(contactId, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith({width: 340, force_ssl: false, contact_id: contactId, method: 'GetContact'}, successCallbackSpy);
    });

    it("get contact without contact id returns", function() {
        bbCore.getContact(null);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("get list contacts", function() {
        var listId = testGuid;

        bbCore.getListContacts(listId, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith({method: "GetListContacts", list_id: listId}, successCallbackSpy);
    });

    it("get list contacts without list id returns", function() {
        bbCore.getListContacts(null);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("add contact", function() {
        var contact = { eml: 'test@test.com' };

        bbCore.addContact(contact, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith({method: "AddContact", contact: contact}, successCallbackSpy);
    });

    it("add contact only works with objects", function() {
        bbCore.addContact(function() {});

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("bulk add contacts without options", function() {
        bbCore.bulkAddContacts(null, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith({method: "BulkAddContacts"}, successCallbackSpy);
    });

    it("bulk add contacts without contacts", function() {
        bbCore.bulkAddContacts({}, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith({method: "BulkAddContacts"}, successCallbackSpy);
    });

    it("bulk add contacts with contacts", function() {
        var contacts = [{eml: 'test@test.com'}];

        bbCore.bulkAddContacts({ contacts: contacts}, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith({contacts : '[{"eml":"test@test.com"}]', method: "BulkAddContacts"}, successCallbackSpy);
    });

    it("update contact", function() {
        var contact = {firstname: 'Timmy'};

        bbCore.updateContact(contact, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith({firstname: 'Timmy', method: 'UpdateContact'}, successCallbackSpy);
    });

    it("update contact with new contact details returns", function() {
        bbCore.updateContact(null, successCallbackSpy);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("get import addresses by type", function() {
        var workflowType = 1;
        var options = {type: workflowType};

        bbCore.getImportAddressesByType(options, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith({method: "getImportAddressesByType", type: options.type}, successCallbackSpy);
    });

    it("get import addresses without type errors", function() {
        spyOn(bbCore, 'onError');

        bbCore.getImportAddressesByType({}, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith({method: 'getImportAddressesByType'}, successCallbackSpy);
        expect(bbCore.onError).toHaveBeenCalledWith(jasmine.any(Object));
    });

    iti("add contact import address")
});
