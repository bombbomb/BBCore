//
// BBCore Video Tests
//
var apiServerUri = 'http://dev.app.bombbomb.com/app/api/api.php';

describe("BBCore Authentication", function() {

    var bbCore = new BBCore({ access_id: 'invalid-token', apiServer: apiServerUri, storage: window.storage });

    var successCallbackSpy = null;
    var errorCallbackSpy = null;

    var result = {
        authenticationSuccess: { status: "success", info: { access_token: '11111111-1111-1111-1111-111111111111', clientId: 'valid-user', userId: 'valid-user' }},
        authenticationFailure: { status: "failure", methodName: 'BadLogin', info: { errormsg: 'invalid session' } }
    };

    function setupMockApiRequest(result) {
        spyOn($, 'ajax').and.callFake(function (e) {
            e.success(result);
        });
    }

    beforeEach(function() {
        successCallbackSpy = jasmine.createSpy();
        errorCallbackSpy = jasmine.createSpy();

        bbCore.onError = errorCallbackSpy;
    });

    it("fail authentication", function () {
        setupMockApiRequest(result.authenticationFailure);

        bbCore.login('badUser', 'badPassword', successCallbackSpy);

        expect(bbCore.isAuthenticated()).toBe(false);
        expect(successCallbackSpy).not.toHaveBeenCalled();
        expect(errorCallbackSpy).toHaveBeenCalledWith(result.authenticationFailure);
    });

    it("fail authentication without user id", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.login(null);

        expect(bbCore.isAuthenticated()).toBe(false);
        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("success authentication", function () {
        setupMockApiRequest(result.authenticationSuccess);

        bbCore.login('goodUser', 'goodPassword', successCallbackSpy);

        expect(bbCore.isAuthenticated()).toBe(true);
        expect(successCallbackSpy).toHaveBeenCalledWith(result.authenticationSuccess);
        expect(errorCallbackSpy).not.toHaveBeenCalled();
    });

    it("success authentication with stored credentials", function() {
        bbCore.saveCredentials('goodUser', 'goodPassword');

        setupMockApiRequest(result.authenticationSuccess);

        bbCore.login(successCallbackSpy);

        expect(bbCore.isAuthenticated()).toBe(true);
        expect(successCallbackSpy).toHaveBeenCalledWith(result.authenticationSuccess);
        expect(errorCallbackSpy).not.toHaveBeenCalled();
    });

    it("logout", function() {
        bbCore.logout();

        expect(!bbCore.storage.getItem('b2-uid')).toBe(true);
        expect(!bbCore.storage.removeItem('b2-pwd')).toBe(true);
        expect(!bbCore.storage.removeItem('access_token')).toBe(true);
        expect(bbCore.hasContext).toBe(false);
        expect(bbCore.authenticated).toBe(false);
    });
});

describe("BBCore Video Recording", function() {
    var successCallbackSpy = null;
    var errorCallbackSpy = null;

    var bbCore = new BBCore({ access_id: 'invalid-token', apiServer: apiServerUri, storage: window.storage });

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

describe("A BBCore Video", function() {

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

