
//
// BBCore Video Tests
//

var apiServerUrl = 'http://dev.app.bombbomb.com';
var requestUrl = apiServerUrl + BBCore.CONFIG.API_END_POINT;
var testGuid = '11111111-1111-1111-1111-111111111111';

var bbCore = null;
var successCallbackSpy = null;

function setupTest(spyOnBBCoreOnError, spyOnBBCoreSendRequest) {
    bbCore = new BBCore({ apiServer: apiServerUrl, storage: global.storage || [] });
    successCallbackSpy = jest.fn()

    return
    if (spyOnBBCoreOnError) {
        spyOn(bbCore, 'onError');
    }

    if (spyOnBBCoreSendRequest) {
        spyOn(bbCore, 'sendRequest');
    }
}

function setupAuthenticatedTest(spyOnBBCoreOnError, spyOnBBCoreSendRequest) {
    setupTest(spyOnBBCoreOnError, spyOnBBCoreSendRequest);
    simulateAuthenticatedApi(bbCore);
}

function simulateAuthenticatedApi(bbCore) {
    // This is only simulate a successful api call to login.  DO NOT do this in your implementation
    bbCore.authenticated = true;
}

function simulateUnauthenticatedApi(bbCore) {
    bbCore.authenticated = false;
}

const spyOnGlobalFetch = (result = {}) => {
  const spy = jest.fn(
    () => new Promise(
      res => res({
        json: () => new Promise(
          inner => inner(result)
        )
      })
    ));

    global.fetch = spy;
    return spy;
}

describe("BBCore", function() {

    beforeEach(function() {
        setupTest(false, false);
    });

    it('should do thing 1', () => {
      expect(true).toBeTruthy()
    })

    it('should do thing 2', () => {
      expect(bbCore).toBeTruthy()
    })

    it('should do thing 3', () => {
      expect(BBCore.CONFIG).toBeTruthy()
    })

    it('should do thing 4', () => {
      expect(bbCore.getVideos).toBeTruthy()
    })

    it("ver", function() {
        expect(bbCore.ver()).toBe(BBCore.CONFIG.VERSION);
    });

    it("onError: func_or_deet is a function", function() {
        var func = function() {};

        bbCore.onError(func, null);

        expect(bbCore.onerror).toBe(func);
    });

    it("onError: func_or_deet is a function", function() {
        var deet = { id: testGuid };
        var xhr = {};
        var funcCallbackSpy = jasmine.createSpy();

        bbCore.onError(funcCallbackSpy, null);
        bbCore.onError(deet, xhr);

        expect(funcCallbackSpy).toHaveBeenCalledWith(deet, xhr);
    });

    it("__mergeProperties", function() {
        var baseProperties = { thisThing: '', otherThing: '', lastThing: { tops: 'bottom' } };
        var expectedResult = { thisThing: 'one', otherThing: 'two', lastThing: { tops: 'bottom', a: '1', b: '2'  } };
        var result = bbCore.__mergeProperties(baseProperties,{ thisThing: 'one', otherThing: 'two', lastThing: { a: '1', b: '2' } });

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });

    it("__mergeProperties against Class", function() {
        var BaseClass = function BaseThing(opts) {
            this.first = '';
            this.second = '';
            this.third = { one: 'a' };
            this.__mergeProperties = bbCore.__mergeProperties;
            this.__mergeProperties.call(this,null,opts)
        };
        var expectedResult = { first: '', second: 'fine', third: { one: 'a', two: 'b'  } };

        expect(JSON.stringify(new BaseClass({ third: { two: 'b' }, second: 'fine' }))).toEqual(JSON.stringify(expectedResult));
    });

});

describe("BBCore.api", function() {
    var result = {
        responseSuccess: {"status":"success","methodName":"GetVideos","info":[{"id":testGuid,"name":"Video Title","description":"Video Description","status":"1","thumbUrl":"thumbnailUrl","shortUrl":"shortUrl","height":"480","width":"640","created":"2\/06\/15 10:33:05 am","vidUrl":"videoDeliveryUrl"}]},
        responseFailure: { status: 'failure', methodName: 'InvalidSession', info: { errormsg: 'Invalid login' } }
    };

    beforeEach(function() {
        setupAuthenticatedTest(true, false);
    });

    it("getServerUrl", function() {
        expect(bbCore.getServerUrl()).toBe(apiServerUrl);
    });

    it("getServerUrl - with default api server url", function() {
        bbCore.apiServer = null;

        expect(bbCore.getServerUrl()).toBe(BBCore.CONFIG.SERVER_API_URL);
    });

    it("getRequestUrl", function() {
        expect(bbCore.getRequestUrl()).toBe(requestUrl);
    });

    it("sendRequest - unauthenticated request errors an does not make async request", function() {

        const spy = spyOnGlobalFetch();
        bbCore.onError = jest.fn()

        bbCore.logout();

        bbCore.sendRequest('GetVideos', { video_id: testGuid });

        expect(bbCore.onError).toHaveBeenCalledWith(result.responseFailure, null);
        expect(spy).not.toHaveBeenCalled();
    });

    xit("sendRequest", function() {
        global.FormData = jest.fn(() => ({append: () => {}}))
        spyOnGlobalFetch(result.responseSuccess);


        const successSpy = jest.fn();
        jest.spyOn(successSpy, 'call')

        bbCore.sendRequest('GetVideos', { video_id: testGuid }, successSpy);
        expect(successSpy.call).toHaveBeenCalled()
        // expect(successCallbackSpy).toHaveBeenCalledWith(result.responseSuccess);
    });

    xit("sendRequest - replace method with params", function() {
        setupMockApiRequest(result.responseSuccess);

        bbCore.sendRequest({ method:  'GetVideos', video_id: testGuid }, successCallbackSpy);

        expect(successCallbackSpy).toHaveBeenCalledWith(result.responseSuccess);
    });

    xit("sendRequest - with a method of GetVideoGuid updates the current video id", function() {
        var response = { status: 'success', info: { video_id: testGuid }};

        setupMockApiRequest(response);

        bbCore.sendRequest({ method: "GetVideoGuid" });

        expect(bbCore.currentVideoId).toBe(testGuid);
    });

    xit("sendRequest - successful ajax request with a failed result", function() {
        setupMockApiRequest(result.responseFailure);

        // simulate successful ajax request to an api method that doesn't exist
        // to represent a failed result
        bbCore.sendRequest({ method: 'InvalidMethod' }, successCallbackSpy);

        expect(successCallbackSpy).not.toHaveBeenCalled();
        expect(bbCore.onError).toHaveBeenCalledWith(result.responseFailure);
    });

    xit("sendRequest - force synchronous request", function() {
        setupMockApiRequest(result.responseSuccess);

        bbCore.sendRequest({ method:  'GetVideos', video_id: testGuid, async: false }, successCallbackSpy);

        expect(successCallbackSpy).toHaveBeenCalledWith(result.responseSuccess);
        expect($.ajax.calls.argsFor(0)[0].async).toBe(false);
    });

    xit("sendRequest - with ajax request error", function() {
        var errorParamCallbackSpy = jasmine.createSpy('errorParamCallbackSpy');
        var xhrResult = { responseJSON: { status: "failure" } };

        setupMockApiRequest(xhrResult, true);

        bbCore.sendRequest('GetVideos', { video_id: testGuid }, successCallbackSpy, errorParamCallbackSpy);

        expect(bbCore.onError).toHaveBeenCalledWith(xhrResult.responseJSON, xhrResult);
        expect(errorParamCallbackSpy).toHaveBeenCalledWith(bbCore, xhrResult.responseJSON);
        expect(successCallbackSpy).not.toHaveBeenCalled();
    });

    xit("sendRequest - with ajax request error when last response was success", function() {
        var errorParamCallbackSpy = jasmine.createSpy('errorParamCallbackSpy');
        var xhrResult = { responseJSON: { status: "success" } };

        setupMockApiRequest(xhrResult, true);

        bbCore.sendRequest('GetVideos', { video_id: testGuid }, successCallbackSpy, errorParamCallbackSpy);

        expect(bbCore.onError).not.toHaveBeenCalled();
        expect(errorParamCallbackSpy).toHaveBeenCalledWith(bbCore, xhrResult.responseJSON);
        expect(successCallbackSpy).toHaveBeenCalledWith(xhrResult.responseJSON, xhrResult);
    });
});

xdescribe("BBCore.auth", function() {
    var username = "test@test.com";
    var password = "password";

    var result = {
        authenticationSuccess: { status: "success", info: { api_key: 'api-key', clientId: 'valid-user', userId: 'valid-user' }},
        authenticationFailure: { status: "failure", methodName: 'BadLogin', info: { errormsg: 'invalid session' } }
    };

    beforeEach(function() {
        setupTest(true, false);
    });

    afterEach(function() {
        bbCore.logout();
    });

    it("login", function () {
        setupMockApiRequest(result.authenticationSuccess);

        bbCore.login(username, password);

        expect(bbCore.userEmail).toBe(username);
        expect(bbCore.isAuthenticated()).toBe(true);
    });

    it("login - without user id does not send async request", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.login(null);

        expect(bbCore.isAuthenticated()).toBe(false);
        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    xit("login - with stored credentials", function() {
        bbCore.saveCredentials(username, password);

        setupMockApiRequest(result.authenticationSuccess);

        bbCore.login(successCallbackSpy);

        expect(bbCore.isAuthenticated()).toBe(true);
        expect(bbCore.credentialsSaved()).toBe(true);
        expect(bbCore.userEmail).toBe(username);
    });

    it("resumeStoredSession - unable to resume stored session when unauthorized", function() {
        var errorCallbackSpy = jasmine.createSpy();

        spyOn(bbCore, 'validateAccessToken');
        spyOn(bbCore, 'login');

        bbCore.resumeStoredSession(null, errorCallbackSpy);

        expect(bbCore.validateAccessToken).not.toHaveBeenCalled();
        expect(bbCore.login).not.toHaveBeenCalled();
        expect(errorCallbackSpy).toHaveBeenCalled();
    });

    it("resumeStoredSession - resume from access token", function() {
        spyOn(bbCore, 'validateAccessToken');
        spyOn(bbCore, 'login');

        bbCore.storage.setItem("access_token", 'test token');   // simulate access token was set.

        bbCore.resumeStoredSession(successCallbackSpy);

        expect(bbCore.validateAccessToken).toHaveBeenCalledWith(successCallbackSpy);
        expect(bbCore.login).not.toHaveBeenCalled();
    });

    it("resumeStoredSession - resume from username", function() {
        var errorCallbackSpy = jasmine.createSpy();

        spyOn(bbCore, 'validateAccessToken');
        spyOn(bbCore, 'login');

        bbCore.saveCredentials(username, password);

        bbCore.resumeStoredSession(successCallbackSpy, errorCallbackSpy);

        expect(bbCore.validateAccessToken).not.toHaveBeenCalled();
        expect(bbCore.credentialsSaved()).toBe(true);
        expect(bbCore.login).toHaveBeenCalledWith(successCallbackSpy);
        expect(errorCallbackSpy).not.toHaveBeenCalled();
    });

    it("logout", function() {
        bbCore.logout();

        expect(bbCore.isAuthenticated()).toBe(false);
    });

    xit("verifyJsonWebToken", function() {
        setupMockApiRequest(result.authenticationSuccess);

        bbCore.verifyJsonWebToken('junkkey',function(){
            console.log('should not be output');
        });

        expect(bbCore.onError).toHaveBeenCalled();
    });

    xit("validateAccessToken", function() {
        setupMockApiRequest(result.authenticationSuccess);

        bbCore.validateAccessToken();

        expect(bbCore.isAuthenticated()).toBe(true);
    });

    xit("validateSession - fails", function() {
        setupMockApiRequest({ status: "success", info: {}});
        spyOn(bbCore, 'clearKey').and.callThrough();

        var successSpy = jasmine.createSpy('successCallbackSpy');
        var errorSpy = jasmine.createSpy('errorCallbackSpy');

        bbCore.validateSession(successSpy,errorSpy);

        expect(successSpy).not.toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalled();
    });

    xit("invalidateSession", function() {
        setupMockApiRequest({ status: "success", info: {}});
        spyOn(bbCore, 'clearKey').and.callThrough();
        simulateAuthenticatedApi(bbCore);

        bbCore.invalidateSession();

        expect(bbCore.clearKey).toHaveBeenCalled();
        expect(bbCore.isAuthenticated()).toBe(false);
    });

    xit("verifyKey", function() {
        setupMockApiRequest({ status: "success", info: {} });
        simulateAuthenticatedApi(bbCore);

        bbCore.verifyKey("successfulApiKey", successCallbackSpy);

        expect(successCallbackSpy).toHaveBeenCalledWith({isValid: true});
    });

    xit("verifyKey - with an invalid api key", function() {
        var result = { status : 'failure', methodName : 'InvalidSession', info : { errormsg : 'Invalid login' } };

        setupMockApiRequest(result);
        simulateUnauthenticatedApi(bbCore);

        bbCore.verifyKey("invalidApiKey", successCallbackSpy);

        expect(bbCore.onError).toHaveBeenCalledWith(result, null);
        expect(successCallbackSpy).not.toHaveBeenCalled();
    });

    it("storeKey", function() {
        var apiKey = "api key";

        bbCore.storeKey(apiKey);

        expect(bbCore.getKey()).toBe(apiKey);
    });

    it("clearKey", function() {
        var apiKey = "api key";

        bbCore.storeKey(apiKey);
        expect(bbCore.getKey()).toBe(apiKey);

        bbCore.clearKey();

        expect(bbCore.getKey()).toBe(null);
    });

    it("getOAuthTokenForRequest", function() {

        var fakeTokenPayload = { token_type: '', access_token: '' };

        spyOn(bbCore, 'getOAuthPayload').and.returnValue(JSON.stringify(fakeTokenPayload));
        spyOn(bbCore, 'isOAuthTokenValid').and.returnValue(true);

        var tokenForRequest = bbCore.getOAuthTokenForRequest();

        expect(bbCore.isOAuthTokenValid).toHaveBeenCalled();
        expect(tokenForRequest).toBe(fakeTokenPayload.token_type+' '+fakeTokenPayload.access_token);

    });

});

xdescribe("BBCore.contacts", function() {
    beforeEach(function() {
        setupAuthenticatedTest(true, true);
    });

    it("getLists", function() {
        bbCore.getLists(successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });

    it("createList", function() {
        var listName = 'Test List';

        bbCore.createList(listName, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ name: listName}), successCallbackSpy);
    });

    it("getContact", function() {
        var contactId = testGuid;

        bbCore.getContact(contactId, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ contact_id: contactId }), successCallbackSpy);
    });

    it("getContact: with an undefined contact id does not make async request", function() {
        bbCore.getContact(null);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("getListContacts", function() {
        var listId = testGuid;

        bbCore.getListContacts(listId, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ list_id: listId }), successCallbackSpy);
    });

    it("getListContacts: with undefined list id does not make async request", function() {
        bbCore.getListContacts(null);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("addContact", function() {
        var contact = { eml: 'test@test.com' };

        bbCore.addContact(contact, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ eml: 'test@test.com' }), successCallbackSpy);
    });

    it("addContact: only works with objects", function() {
        bbCore.addContact(function() {});

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("bulkAddContacts: without options", function() {
        bbCore.bulkAddContacts(null, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });

    it("bulkAddContacts: without contacts", function() {
        bbCore.bulkAddContacts({}, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });

    it("bulkAddContacts: with contacts", function() {
        var contacts = [{eml: 'test@test.com'}];

        bbCore.bulkAddContacts({ contacts: contacts}, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ contacts : '[{"eml":"test@test.com"}]' }), successCallbackSpy);
    });

    it("updateContact", function() {
        var contact = { firstname: 'Timmy' };

        bbCore.updateContact(contact, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ firstname: 'Timmy' }), successCallbackSpy);
    });

    it("updateContact: with undefined contact details does not make async request", function() {
        bbCore.updateContact(null, successCallbackSpy);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("getImportAddressesByType", function() {
        var workflowType = 1;
        var options = {type: workflowType};

        bbCore.getImportAddressesByType(options, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });

    it("getImportAddressesByType: without a type defined calls BBCore.onError", function() {
        bbCore.getImportAddressesByType({}, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });

    it("addContactImportAddress", function() {
        bbCore.addContactImportAddress({ importAddrCode: 1, importAddrName: 'name' }, successCallbackSpy);

        expect(bbCore.onError).not.toHaveBeenCalled();
        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ importAddrCode: 1, importAddrName: 'name' }), successCallbackSpy);
    });

    it("addContactImportAddress: with an undefined importAddrCode calls BBCore.onError", function() {
        bbCore.addContactImportAddress({ importAddrName: 'name' }, successCallbackSpy);

        expect(bbCore.onError).toHaveBeenCalled();
        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ importAddrName: 'name' }), successCallbackSpy);
    });

    it("addContactImportAddress: with an undefined importAddrName calls BBCore.onError", function() {
        bbCore.addContactImportAddress({ importAddrCode: 1 }, successCallbackSpy);

        expect(bbCore.onError).toHaveBeenCalled();
        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ importAddrCode: 1 }), successCallbackSpy);
    });

    it("addContactImportAddress: with both undefined importAddrCode and importAddrName calls BBCore.onError", function() {
        bbCore.addContactImportAddress(null, successCallbackSpy);

        expect(bbCore.onError).toHaveBeenCalled();
        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });

    it("deleteContactImportAddress", function() {
        bbCore.deleteContactImportAddress(null, successCallbackSpy);

        expect(bbCore.onError).not.toHaveBeenCalled();
        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ importAddrCode: 1 }), successCallbackSpy);
    });

    it("deleteContactImportAddress: with invalid importAddrCode calls BBCore.onError", function() {
        bbCore.deleteContactImportAddress({ importAddrCode: null }, successCallbackSpy);

        expect(bbCore.onError).toHaveBeenCalled();
        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ importAddrCode: null }), successCallbackSpy);
    });

    it("getClientRecentInteractions", function() {
        bbCore.getClientRecentInteractions(null, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });
});

describe("BBCore.email", function() {
    beforeEach(function() {
        setupAuthenticatedTest(false, true);
    });

    xit("getEmails", function() {
        bbCore.getEmails(successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });

    xit("sendCustomVideoEmail", function() {
        var options = {html_content: 'html content', subject: 'email subject', email: 'test@test.com', email_id: testGuid, from_name: 'from@test.com'};

        bbCore.sendCustomVideoEmail(options, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining(options), successCallbackSpy);
    });
});

describe("BBCore.extras", function() {
    beforeEach(function() {
        setupAuthenticatedTest(false, true);
    });

    xit("getDrips", function() {
        bbCore.getDrips(null, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });

    xit("getForms", function() {
        bbCore.getForms(null, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });

    xit("getClientIntegrations", function() {
        bbCore.getClientIntegrations(successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });
    xit("getClientIntegrations with Options", function() {
        bbCore.getClientIntegrations({ integrationCode: 'GAPPS' }, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), successCallbackSpy);
    });
});

describe("BBCore.video", function() {
    var validVideoId = testGuid;

    beforeEach(function() {
        setupAuthenticatedTest(false, false);
    });

    it("getVideoDeliveryUrl", function() {
        var expected = 'http://dev.bbemaildelivery.com/bbext/?p=video_land&id=' + testGuid + '&autoplay=0';

        var actual = bbCore.getVideoDeliveryUrl({ video_id: testGuid, autoplay: 0 });

        expect(actual).toBe(expected);
    });

    it("getVideo", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getVideo(validVideoId, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({video_id: validVideoId}), successCallbackSpy);
    });

    it("getVideo: with undefined video id does not make async request", function() {
        spyOn(bbCore, 'sendRequest');

        BBCore.prototype.getVideo(null);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("getVideos", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getVideos({}, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({method: "GetVideos"}), successCallbackSpy);
    });

    it("getVideos: using default options falls back on legacy GetVideos api method", function() {
        var func = function() {};

        spyOn(bbCore, 'sendRequest');

        bbCore.getVideos(func);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({method: "GetVideos"}), func);
    });

    it("getVideos: invalid page falls back to legacy GetVideos api method", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getVideos({ page: null }, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({method: "GetVideos"}), successCallbackSpy);
    });

    it("getVideos: requesting paged videos using default page size", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getVideos({ page: 1 }, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({method: "GetVideosPaged", page: 1, pageSize: 50}), successCallbackSpy);
    });

    it("getVideos: requesting paged videos using null page size uses default page size", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getVideos({ page: 1, pageSize: null }, successCallbackSpy);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("getVideos: requesting paged videos using zero page size does not make the async request", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getVideos({ page: 1, pageSize: 0 }, successCallbackSpy);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("getVideos: requesting paged videos using a less than zero page size does not make the async request", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getVideos({ page: 1, pageSize: -1 }, successCallbackSpy);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("getVideos: requesting paged videos using an invalid page size does not make the async request", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getVideos({ page: 1, pageSize: "asdf" }, successCallbackSpy);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    // TODO: test getVideos with custom options
    // TODO: test getVideos using paging options

    it("getVideoStatus", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getVideoStatus(validVideoId, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ id: validVideoId }), successCallbackSpy);
    });

    it("getVideoStatus: with undefined video id does not make async request", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getVideoStatus(null);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("getEncodingReport", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getEncodingReport(validVideoId, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ id: validVideoId }), successCallbackSpy);
    });

    it("getEncodingReport: with undefined video id does not make async request", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.getEncodingReport(null);

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });

    it("deleteVideo", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.deleteVideo(validVideoId, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ video_id: validVideoId }), successCallbackSpy);
    });

    it("getVideoId", function() {
        bbCore.setVideoId(validVideoId);
        bbCore.getVideoId(function(videoId) {
            expect(videoId).toBe(validVideoId);
        });
    });

    xit("getVideoId: current video id has not been set yet", function() {
        spyOn(bbCore, 'getNewVideoGuid');

        bbCore.setVideoId(null);
        bbCore.getVideoId(successCallbackSpy);

        expect(bbCore.getNewVideoGuid).toHaveBeenCalledWith(successCallbackSpy);
    });

    xit("hasVideoId", function() {
        bbCore.setVideoId(validVideoId);

        expect(bbCore.hasVideoId()).toBe(true);
    });

    xit("hasVideoId: without a video id set", function() {
        bbCore.setVideoId(null);

        expect(bbCore.hasVideoId()).toBe(false);
    });

    xit("getNewVideoGuid", function() {
        spyOn(bbCore, 'sendRequest').and.callThrough();
        spyOn($, 'ajax').and.callFake(function(e) {
            e.success({ status: "success", info: { video_id: validVideoId }});
        });

        bbCore.getNewVideoGuid(successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalled();
        expect(bbCore.hasVideoId()).toBe(true);
        expect(successCallbackSpy).toHaveBeenCalledWith(validVideoId);
    });

    xit("videoQuickSend", function() {
        spyOn(bbCore, "sendRequest");

        bbCore.videoQuickSend({ video_id: validVideoId, subject: "quick send subject", email_address: "test@test.com"});

        expect(bbCore.sendRequest).toHaveBeenCalled();
    });

    xit("videoQuickSend: using alternative properties", function() {
        var message = "message";
        var email = "test@test.com";

        spyOn(bbCore, "sendRequest");

        bbCore.videoQuickSend({ video_id: validVideoId, subject: "quick send subject", message: message, email: email }, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ mobile_message: message, email_address: email}), successCallbackSpy);
    });

    xit("videoQuickSend: using current video id", function() {
        spyOn(bbCore, "sendRequest");

        bbCore.setVideoId(validVideoId);
        bbCore.videoQuickSend({ subject: "quick send subject", email_address: "test@test.com"}, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ video_id: validVideoId }), successCallbackSpy);
    });

    xit("videoQuickSend: with undefined video_id and no current video id generates a new video id", function() {
        spyOn(bbCore, 'getNewVideoGuid').and.callFake(function(pCall) {
            pCall.call(bbCore, testGuid);
        });
        spyOn(bbCore, "sendRequest");

        bbCore.videoQuickSend({ subject: "quick send subject", email_address: "test@test.com"}, successCallbackSpy);

        expect(bbCore.getNewVideoGuid).toHaveBeenCalled();
        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ video_id: testGuid }), successCallbackSpy);
    });

    xit("videoQuickSend: with undefined video_id and no current video id fails to generate a new video id", function() {
        spyOn(bbCore, 'getNewVideoGuid').and.callFake(function(pCall) {
            pCall.call(bbCore, null);
        });
        spyOn(bbCore, "sendRequest");
        spyOn(bbCore, 'onError');

        bbCore.videoQuickSend({ subject: "quick send subject", email_address: "test@test.com"}, successCallbackSpy);

        expect(bbCore.getNewVideoGuid).toHaveBeenCalled();
        expect(bbCore.sendRequest).not.toHaveBeenCalled();
        expect(bbCore.onError).toHaveBeenCalled();
    });

    // TODO: test videoQuickSend erroring async request when trying to generate a new video id

    xit("videoQuickSend: attempts to send without a subject", function() {
        spyOn(bbCore, "sendRequest");

        bbCore.videoQuickSend({ video_id: validVideoId, email_address: "test@test.com"});

        expect(bbCore.sendRequest).toHaveBeenCalled();
    });

    xit("videoQuickSend: attempts to send without an email address", function() {
        spyOn(bbCore, "sendRequest");

        bbCore.videoQuickSend({ video_id: validVideoId, subject: "quick send subject" });

        expect(bbCore.sendRequest).toHaveBeenCalled();
    });
});

describe("BBCore.videoRecorder", function() {
    var result = {
        withOptionsSuccess: { status: "success", info: { user_id: '<Guid>', email: 'test@test.com', client_id: '<Guid>', vid_id: '<Guid>', content: '<Video Recorder Html>', width: 640, height: 480, https: true }},
        withDefaultOptionsSuccess: { status: "success", info: { user_id: '<Guid>', email: 'test@test.com', client_id: '<Guid>', vid_id: '<Guid>', content: '<Video Recorder Html>', width: 320, height: 240, https: false }},
        authenticationFailure: { status: "failure", methodName: 'BadLogin', info: { errormsg: 'invalid session' } }
    };

    beforeEach(function() {
        setupAuthenticatedTest(true, false);
    });

    xit("getEmbeddedRecorderUrl with Legacy Access Token", function() {
        var apiKey = "api key";
        var requestParams = $.param({ width: 640, height: 480, module: 'videos', page: 'EmbeddedRecorder', popup: 1, nohtml: 1, api_key: apiKey });
        var expectedUrl = apiServerUrl + '/app/?module=login&actn=login&api_key=' + apiKey + '&redir=' + btoa(apiServerUrl + '/app/?' + requestParams + '&vguid=' + testGuid);

        spyOn(bbCore, 'getKey').and.callFake(function() {
            return apiKey;
        });

        bbCore.setVideoId(testGuid);
        bbCore.getEmbeddedRecorderUrl({ width: 640, height: 480 }, successCallbackSpy);

        expect(successCallbackSpy).toHaveBeenCalledWith({ url: expectedUrl, video_id: testGuid });
    });

    xit("getEmbeddedRecorderUrl using OAuth", function() {
        var apiKey = "api key";
        var requestParams = $.param({ width: 640, height: 480, module: 'videos', page: 'EmbeddedRecorder', popup: 1, nohtml: 1 });
        var expectedUrl = apiServerUrl + '/app/?' + requestParams + '&vguid=' + testGuid;

        spyOn(bbCore, 'getKey').and.callFake(function() {
            return null;
        });

        spyOn(bbCore, 'getVideoRecorder').and.callFake(function(opts,onComplete) {
            onComplete({ info: { content: '<div><iframe src="'+expectedUrl+'"></iframe></div>' } });
        });

        bbCore.setVideoId(testGuid);
        bbCore.getEmbeddedRecorderUrl({ width: 640, height: 480 }, successCallbackSpy);

        expect(successCallbackSpy).toHaveBeenCalledWith({ url: expectedUrl, video_id: testGuid });
    });

    xit("getEmbeddedRecorderUrl: with undefined height uses default options", function() {
        var apiKey = "api key";
        var requestParams = $.param({ height: 240, width: 320, force_ssl: true, module: 'videos', page: 'EmbeddedRecorder', popup: 1, nohtml: 1, api_key: apiKey });
        var expectedUrl = apiServerUrl + '/app/?module=login&actn=login&api_key=' + apiKey + '&redir=' + btoa(apiServerUrl + '/app/?' + requestParams + '&vguid=' + testGuid);

        spyOn(bbCore, 'getKey').and.callFake(function() {
            return apiKey;
        });

        bbCore.setVideoId(testGuid);
        bbCore.getEmbeddedRecorderUrl({ width: 320, force_ssl: true }, successCallbackSpy);

        expect(successCallbackSpy).toHaveBeenCalledWith({ url: expectedUrl, video_id: testGuid });
    });

    xit("getEmbeddedRecorderUrl: with undefined options uses default options", function() {
        var apiKey = "api key";
        var requestParams = $.param({ height: 240, width: 320, force_ssl: false, module: 'videos', page: 'EmbeddedRecorder', popup: 1, nohtml: 1, api_key: apiKey });
        var expectedUrl = apiServerUrl + '/app/?module=login&actn=login&api_key=' + apiKey + '&redir=' + btoa(apiServerUrl + '/app/?' + requestParams + '&vguid=' + testGuid);

        spyOn(bbCore, 'getKey').and.callFake(function() {
            return apiKey;
        });

        bbCore.setVideoId(testGuid);
        bbCore.getEmbeddedRecorderUrl(successCallbackSpy);

        expect(successCallbackSpy).toHaveBeenCalledWith({ url: expectedUrl, video_id: testGuid });
    });

    xit("getVideoRecorder: error when unauthenticated", function() {
        bbCore.logout();

        expect(bbCore.isAuthenticated()).toBe(false);

        bbCore.getVideoRecorder();

        expect(bbCore.onError).toHaveBeenCalled();
    });

    xit("getVideoRecorder: with options", function() {
        var opts = { height: 480, width: 640, force_ssl: true, start: null, stop: null, recorded: null };

        setupMockApiRequest(result.withOptionsSuccess);

        bbCore.getVideoRecorder(opts, successCallbackSpy);
        data = $.ajax.calls.argsFor(0)[0].data
        for (var k in opts) {
          expect(data[k]).toEqual(opts[k]);
        }
        expect(successCallbackSpy).toHaveBeenCalledWith(result.withOptionsSuccess);
    });

    xit("getVideoRecorder: without options", function() {
        var defaultOptions = { height: 240, width: 320, force_ssl: false, start: null, stop: null, recorded: null, method : 'GetVideoRecorder', api_key : null };

        setupMockApiRequest(result.withDefaultOptionsSuccess);

        bbCore.getVideoRecorder(successCallbackSpy);

        expect($.ajax.calls.argsFor(0)[0].data).toEqual(defaultOptions);
        expect(successCallbackSpy).toHaveBeenCalledWith(result.withDefaultOptionsSuccess);
    });

    xit("startVideoRecorder", function() {
        var options = { width: 640, height: 480, recorderLoaded: jasmine.createSpy() };
        var result = { status: "success", info: { vid_id: testGuid } };

        setupMockApiRequest(result);

        bbCore.startVideoRecorder(options, successCallbackSpy);

        expect(bbCore.currentVideoId).toBe(testGuid);
        expect(options.recorderLoaded).toHaveBeenCalledWith(result.info);
        expect(window.bbStreamStartRecord !== undefined).toBe(true);
        expect(window.bbStreamStopRecord !== undefined).toBe(true);
        expect(window.reportVideoRecorded !== undefined).toBe(true);
    });

    xit("startVideoRecorder: with default options", function() {
        spyOn(bbCore, 'getVideoRecorder');

        bbCore.startVideoRecorder(successCallbackSpy);

        expect(bbCore.getVideoRecorder).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Function));
        expect(window.bbStreamStartRecord !== undefined).toBe(true);
        expect(window.bbStreamStopRecord !== undefined).toBe(true);
        expect(window.reportVideoRecorded !== undefined).toBe(true);
    });

    xit("startVideoRecorder: specify recordComplete callback in options", function() {
        var options = { recordComplete: successCallbackSpy };
        var videoFilename = "video file name";
        var log = "log";

        spyOn(bbCore, 'getVideoRecorder');

        bbCore.setVideoId(testGuid);
        bbCore.startVideoRecorder(options);
        window.reportVideoRecorded(videoFilename, log);

        expect(bbCore.getVideoRecorder).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Function));
        expect(successCallbackSpy).toHaveBeenCalledWith({videoId: testGuid, filename: videoFilename, log: log});
        expect(window.bbStreamStartRecord !== undefined).toBe(true);
        expect(window.bbStreamStopRecord !== undefined).toBe(true);
        expect(window.reportVideoRecorded !== undefined).toBe(true);
    });

    xit("startVideoRecorder: specify recordComplete callback in options", function() {
        var options = { recordComplete: successCallbackSpy };
        var streamName = "stream name";
        var videoFilename = "video file name";

        spyOn(bbCore, 'liveStreamStartRecord');
        spyOn(bbCore, 'liveStreamStopRecord');

        bbCore.setVideoId(testGuid);
        bbCore.startVideoRecorder(options);

        window.bbStreamStartRecord(streamName, videoFilename);
        window.bbStreamStopRecord(streamName);

        expect(bbCore.liveStreamStartRecord).toHaveBeenCalledWith(streamName, videoFilename);
        expect(bbCore.liveStreamStopRecord).toHaveBeenCalledWith(streamName);
    });

    xit("destroyVideoRecorder", function() {
        bbCore.__vidRecHndl = $('body').append('<div id="b2recorder"></div>');

        bbCore.destroyVideoRecorder();

        expect(window.bbStreamStartRecord).toBe(null);
        expect(window.bbStreamStopRecord).toBe(null);
        expect(window.reportVideoRecorded).toBe(null);
    });

    xit("liveStreamStartRecord", function() {
        var streamName = "video stream name";
        var filename = "video file name";

        spyOn(bbCore, 'sendRequest');

        bbCore.liveStreamStartRecord(streamName, filename);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({streamname: streamName, filename: filename}));
    });

    xit("liveStreamStopRecord", function() {
        var streamName = "video stream name";

        spyOn(bbCore, 'sendRequest');

        bbCore.liveStreamStopRecord(streamName);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({streamname: streamName}));
    });

    xit("saveRecordedVideo", function() {
        var videoTitle = "video title";
        var videoId = testGuid;
        var videoFilename = "video file name";
        var result = { status: "success", info: {} };

        spyOn(bbCore, 'sendRequest').and.callThrough();
        setupMockApiRequest(result);

        bbCore.saveRecordedVideo(videoTitle, videoId, videoFilename, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ title: videoTitle, filename: videoFilename, vid_id: videoId}), jasmine.any(Function));
        expect(successCallbackSpy).toHaveBeenCalledWith(result);
    });

    xit("saveRecordedVideo: with undefined video id uses current video id", function() {
        var videoTitle = "video title";
        var videoId = null;
        var videoFilename = "video file name";
        var result = { status: "success", info: {} };

        spyOn(bbCore, 'sendRequest').and.callThrough();
        setupMockApiRequest(result);

        bbCore.setVideoId(testGuid);
        bbCore.saveRecordedVideo(videoTitle, videoId, videoFilename, successCallbackSpy);

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({ title: videoTitle, filename: videoFilename, vid_id: testGuid}), jasmine.any(Function));
        expect(successCallbackSpy).toHaveBeenCalledWith(result);
    });

    xit("saveRecording", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.saveRecording({ vid_id: testGuid });

        expect(bbCore.sendRequest).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({ vid_id: testGuid }), jasmine.any(Function));
    });

    xit("saveRecording: with an undefind vid_id does not make an async request", function() {
        spyOn(bbCore, 'sendRequest');

        bbCore.saveRecording({  });

        expect(bbCore.sendRequest).not.toHaveBeenCalled();
    });
});
