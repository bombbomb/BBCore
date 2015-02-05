//
// BBCore Video Tests
//
var apiServerUri = 'http://dev.app.bombbomb.com/app/api/api.php';

describe("BBCore Authentication", function() {

    var successCallback = null;
    var errorCallback = null;

    var bbCore = new BBCore({ access_id: 'invalid-token', apiServer: apiServerUri });

    var result = {
        authenticationSuccess: { status: "success", info: { access_token: '11111111-1111-1111-1111-111111111111', clientId: 'valid-user', userId: 'valid-user' }},
        authenticationFailure: { status: "failure", info: 'error message' }
    };

    beforeEach(function() {
        successCallback = jasmine.createSpy();
        errorCallback = jasmine.createSpy();

        bbCore.onError = errorCallback;
    });

    it("fail authentication", function () {
        spyOn($, 'ajax').and.callFake(function(e) {
            e.success(result.authenticationFailure);
        });

        bbCore.login('baduser','badpassword', successCallback);

        expect(bbCore.isAuthenticated()).toBe(false);
        expect(successCallback.calls.count()).toEqual(0);
        expect(errorCallback).toHaveBeenCalled();
    });

    it("success authentication", function () {
        spyOn($, 'ajax').and.callFake(function(e) {
            e.success(result.authenticationSuccess);
        });

        bbCore.login('gooduser','goodpassword',successCallback);

        expect(bbCore.isAuthenticated()).toBe(true);
        expect(successCallback).toHaveBeenCalledWith(result.authenticationSuccess);
        expect(errorCallback.calls.count()).toEqual(0);
    });

});

describe("A BBCore Video", function() {

    var bbCore = new BBCore({ access_id: 'test', apiServer: apiServerUri });

    it("fail authentication", function() {
        var validVideoId = '11111111-1111-1111-1111-111111111111';
        var successCallback = jasmine.createSpy();
        var result = { status: "success", info: { video_id: validVideoId }};

        spyOn($, 'ajax').and.callFake(function(e) {
            e.success(result);
        });

        bbCore.getVideo(validVideoId, successCallback);

        expect(successCallback).toHaveBeenCalledWith(result);
    });

    it("exists with a valid id", function() {
        var validVideoId = '11111111-1111-1111-1111-111111111111';
        var successCallback = jasmine.createSpy();
        var result = { status: "success", info: { video_id: validVideoId }};

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