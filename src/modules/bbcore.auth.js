/**
 * Authenticates a user using their Email Address (User Id) and Password
 * @arg {string} uid
 * @arg {string} pwd
 * @arg {responseSuccess} success
 */
BBCore.prototype.login = function (uid, pwd, success) {
    if (arguments.length < 2 && this.credentials)
    {
        var locationTarget = window;
        if (typeof usePopup !== 'undefined')
        {
            locationTarget = window.open("about:blank", "_blank");
        }
        locationTarget.location = this.getOAuthUrl();
    }
    else
    {
        if (typeof uid === "function") {
            success = uid;
            uid = this.storage.getItem('b2-uid');
            pwd = this.storage.getItem('b2-pwd');
        }

        if (!uid && !this.accessToken) {
            this.onError({ info: { errormsg: 'Username cannot be blank' } });
            return;
        }

        this.userEmail = uid;

        var inst = this;
        this.sendRequest({method: "ValidateSession", email: uid, pw: pwd, jwt: true}, function (respObj) {
            inst.__updateSession(respObj, success);
        });
    }
};

BBCore.prototype.logout = function () {
    this.clearJsonWebToken();
    this.clearKey();
    this.storage.removeItem('b2-uid');
    this.storage.removeItem('b2-pwd');
    this.hasContext = false;
    this.authenticated = false;
};

/**
 * Returns bool for whether or not a prior authentication is stored locally
 * @returns {boolean}
 */
BBCore.prototype.credentialsSaved = function () {
    return null !== this.storage.getItem("b2-uid") || null !== this.storage.getItem("access_token") || null !== this.storage.getItem("jsonWebToken");
};

/**
 * Save credentials to local storage (not recommended)
 * @arg {string} uid - User ID/Email Address
 * @arg {string} pwd - Password
 */
BBCore.prototype.saveCredentials = function (uid, pwd) {
    this.storage.setItem("b2-uid", uid);
};

/**
 * Authenticates from previously stored credentials
 * @arg {responseSuccess} onSuccess
 * @arg {responseSuccess} onError
 */
BBCore.prototype.validateSession = function (onSuccess, onError) {

    var oAuthPayload = this.getOAuthPayload();
    var authCode = /[\?\#].*&*(access_token|code)=([^&]+)/gi.exec(window.location);
    if (authCode && authCode.length > 1)
    {
        var tokenOrCode = authCode[2];
        if (authCode[1] === 'code')
        {
            this.validateOAuthCode(decodeURIComponent(tokenOrCode), function(payload){
                this.storeOAuthTokens(payload);
                window.location.href = authCode[0].substr(0,5) === '?code' ? window.location.href.replace('?code='+tokenOrCode,'') : window.location.href.replace('&code='+authCode[1],'');
            }, onError);
        }
        else
        {
            var authPayload = { access_token: tokenOrCode, token_type: null, expires_in: null },
                cleanedHash = window.location.hash.replace('access_token='+tokenOrCode,''),
                hashKeyMatches = null;
            while (hashKeyMatches = /\&*(token_type|expires_in)=([^&]+)/gi.exec(window.location.hash))
            {
                authPayload[hashKeyMatches[1]] = hashKeyMatches[2];
                cleanedHash = cleanedHash.replace(hashKeyMatches[0],'');
                window.location.hash = cleanedHash.length > 1 ? cleanedHash : '';
            }
            this.authenticated = true;
            this.storeOAuthTokens(authPayload);
            onSuccess.call(inst);
        }
    }
    else if (this.isOAuthTokenValid(oAuthPayload))
    {
        var jwtPayload = this.__getOAuthAccessPayload(oAuthPayload);
        this.__updateSession({ status: "success", info: { clientId: jwtPayload.bbcid, userId: jwtPayload.sub } },function(){
            onSuccess.call(inst);
        });
    }
    else if (!this.getKey() && this.getJsonWebToken())
    {
        var inst = this;
        this.verifyJsonWebToken(function(response){
            inst.__updateSession(response);
            onSuccess.call(inst,response);
        });
    }
    else
    {
        if (this.getKey()) {
            this.validateAccessToken(onSuccess);
        }
        else if (this.storage.getItem("b2-uid")) {
            this.login(onSuccess);
        }
        else {
            if (onError) onError();
        }
    }
};

BBCore.prototype.getOAuthUrl = function()
{
    var url = null,
        oAuthCreds = this.credentials;
    if (oAuthCreds.clientIdentifier && oAuthCreds.redirectUri)
    {
        url = this.getServerUrl()+"/auth/authorize?"
            +"client_id="+oAuthCreds.clientIdentifier
            +"&scope="+encodeURIComponent(oAuthCreds.scope ? oAuthCreds.scope : 'all:manage')
            +"&redirect_uri="+encodeURIComponent(oAuthCreds.redirectUri)
            +"&response_type=" + (oAuthCreds.type === 'implicit' ? "token" : "code");
    }
    return url;

};

/**
 * DEPRECATED - Alias for resumeSession
 */
BBCore.prototype.resumeStoredSession = BBCore.prototype.validateSession;

/**
 *
 * @param onSuccess
 */
BBCore.prototype.validateAccessToken = function (onSuccess) {
    var inst = this;
    this.sendRequest({method: "ValidateSession", api_key: this.accessToken, async: false, jwt: true}, function (respObj) {
        inst.__updateSession(respObj, onSuccess);
    });
};


/**
 * Returns bool for authentication state
 * @returns {boolean|*}
 */
BBCore.prototype.isAuthenticated = function () {
    if (!this.authenticated) {
        console.log('You must authenticate a BombBomb session before making additional calls.');
    }
    return this.authenticated;
};

/**
 * Invalidates and clears the active session
 */
BBCore.prototype.invalidateSession = function()
{
    try
    {
        this.clearOAuthToken();
        this.clearKey();
        this.accessToken = "";
        this.authenticated = false;
        this.hasContext = false;
    }
    catch (e)
    {
        return false;
    }
    return true;
};

BBCore.prototype.__updateSession = function (respObj, done) {
    if (respObj.status === "success") {
        if (respObj.info.userId)
        {
            this.userId = respObj.info.userId;
            this.clientId = respObj.info.clientId;
        }
        else
        {
            this.userId = respObj.info.user_id;
            this.clientId = respObj.info.client_id;
        }

        if (respObj.info.api_key)
        {
            this.accessToken = respObj.info.api_key;
        }

        this.hasContext = true;
        this.authenticated = true;

        this.storeKey(this.accessToken);
        this.storeJsonWebToken(respObj.info.jwtoken);

        console.log('bbcore: __updateSession session updated.');

        if (done) {
            done.call(this, respObj);
        }
    }
};


/**
 * Validates the given key
 * @arg {string} key
 * @arg {responseSuccess} complete
 */
BBCore.prototype.verifyKey = function (key, complete) {
    // TODO; should ValidateSession replace this or vise-versa
    this.sendRequest({method: "GetEmails", api_key: key}, function (resp) {
        if (complete) {
            complete({isValid: (resp.status === "success")});
        }
    });
};

/**
 * Stores the give session key, typically used so a session can be resumed later on.
 * @arg key
 */
BBCore.prototype.storeKey = function (key) {
    if (!key)
    {
        return;
    }

    // currently this will use the API Key, in the future this should be updated to use a key which can be expired
    this.accessToken = key;
    this.storage.setItem("access_token", this.accessToken);
};

BBCore.prototype.getKey = function () {
    return this.accessToken ? this.accessToken : this.storage.getItem("access_token");
};
BBCore.prototype.clearKey = function () {
    this.accessToken = null;
    this.storage.removeItem('access_token');
};


/**
 * Validates the given key
 * @arg {string} key
 * @arg {responseSuccess} complete
 */
BBCore.prototype.verifyJsonWebToken = function (key, complete) {
    if (typeof key == 'function')
    {
        complete = key;
        key = this.getJsonWebToken();
    }
    this.sendRequest({method: "ValidateJsonWebToken", jwt: key}, function (resp) {
        if (complete)
        {
            resp.isValid = (resp.status === "success");
            complete(resp);
        }
    });
};

/**
 * Stores the OAuth Token for API calls
 * @arg key
 */
BBCore.prototype.storeOAuthTokens = function(oAuthPayload) {
    if (!oAuthPayload)
    {
        return;
    }
    try
    {
        oAuthPayload = typeof oAuthPayload === 'string' ? oAuthPayload : JSON.stringify(oAuthPayload);
        this.storage.setItem(BBCore.CONFIG.OAUTH_STORAGE, btoa(oAuthPayload));
    }
    catch (e)
    {
    }
};

/**
 *
 * @returns {string}
 */
BBCore.prototype.getOAuthPayload = function()
{
    var storagePayload = this.storage.getItem(BBCore.CONFIG.OAUTH_STORAGE);
    return storagePayload ? atob(storagePayload) : null;
};

BBCore.prototype.getOAuthTokenForRequest = function() {
    var token = null;
    try
    {
        var storagePayload = this.getOAuthPayload();
        if (storagePayload && this.isOAuthTokenValid(storagePayload))
        {
            var parsedPayload = JSON.parse(storagePayload);
            if (typeof parsedPayload === 'object')
            {
                token = parsedPayload.token_type.substr(0,1).toUpperCase()+parsedPayload.token_type.substr(1) + ' ' + parsedPayload.access_token;
            }
        }
    }
    catch (e)
    {
        console.error("Exception occurred retrieving OAuth Token for Request",e);
    }
    return token;
};

BBCore.prototype.clearOAuthToken = function () {
    this.authenticated = false;
    this.storage.removeItem(BBCore.CONFIG.OAUTH_STORAGE);
};

BBCore.prototype.__getOAuthAccessPayload = function(payload) {
    var jsonPayload = typeof payload === 'string' ? JSON.parse(payload) : payload,
        jwtObj = null;
    if (jsonPayload)
    {
        try
        {
            var jwtParts = jsonPayload.access_token.split('.');
            if (jwtParts.length > 2)
            {
                jwtObj = JSON.parse(atob(jwtParts[1]));
            }
        }
        catch (e)
        {
            console.warn('Exception __getOAuthAccessPayload fetching access_token payload',e);
        }
    }
    return jwtObj;
};

BBCore.prototype.isOAuthTokenValid = function(payload) {

    var isValid = false;
    try
    {
        var jwtObj = this.__getOAuthAccessPayload(payload);
        if (jwtObj && (new Date(jwtObj.exp)) < Date.now())
        {
            isValid = true;
        }
    }
    catch (e)
    {
        console.warn('Exception while validating OAuthToken',e);
    }
    return isValid;

};

/**
 *
 * @param authCode
 * @param onSuccess
 * @param onError
 */
BBCore.prototype.validateOAuthCode = function(authCode, onSuccess, onError) {

    var inst = this,
        credentials = this.credentials,
        authRequestPayload = {
            url: this.getServerUrl() + '/auth/access_token',
            grant_type: credentials.type || 'implicit',
            client_id: credentials.clientIdentifier,
            redirect_uri: credentials.redirectUri,
            code: JSON.stringify(authCode)
        };
    if (credentials.type !== 'implicit')
    {
        if (credentials.clientSecret && credentials.clientSecret)
        {
            authRequestPayload.client_secret = credentials.clientSecret;
        }
        else
        {
            var warningMessage = 'Client Secret required when making '+credentials.type+' grant requests';
            console.warn(warningMessage);
            onError.call(this,warningMessage);
            return;
        }
    }
    this.sendRequest(authRequestPayload, function(resp) {
        if (resp && this.isOAuthTokenValid(resp))
        {
            this.authenticated = true;
            this.storeOAuthTokens(resp);
            onSuccess && onSuccess.call(inst);
        }
        else
        {
            onError && onError.call(inst);
        }
    });
};

/**
 *
 */
BBCore.prototype.refreshOAuthToken = function(onSuccess) {

    var credentials = this.credentials,
        refreshRequestPayload = {
            url: this.getServerUrl() + '/auth/access_token',
            grant_type: 'refresh_token',
            refresh_token: this.getOAuthRefreshToken(),
            client_id: credentials.clientIdentifier,
            client_secret: credentials.clientSecret,
            redirect_uri: credentials.redirectUri,
            code: JSON.stringify(authCode)
        };
    this.sendRequest(refreshRequestPayload, function(resp) {
        console.log('got refresh auth back',resp);
        if (resp)
        {
            if (this.isOAuthTokenValid(resp))
            {
                this.authenticated = true;
            }
            this.storeOAuthTokens(resp);
            onSuccess && onSuccess();
        }
    });
};

/**
 * Stores the give session key, typically used so a session can be resumed later on.
 * @arg key
 */
BBCore.prototype.storeJsonWebToken = function (token) {
    if (!token)
    {
        return;
    }
    this.jsonWebToken = token;
    this.storage.setItem("jsonWebToken", this.jsonWebToken);
};

BBCore.prototype.getJsonWebToken = function () {
    return this.jsonWebToken ? this.jsonWebToken : this.storage.getItem("jsonWebToken");
};
BBCore.prototype.clearJsonWebToken = function () {
    this.jsonWebToken = null;
    this.storage.removeItem('jsonWebToken');
};

/**
 * Attempts to always return a valid JWT which makes an async verification request
 * @param callback - handler given a valid JWT.  If the JWT is null then the user
 * is NOT authenticated.
 */
BBCore.prototype.getValidJsonWebTokenAsync = function(callback) {
    var currentToken = this.getJsonWebToken();
    if (!currentToken && callback) {
        callback(null);
        return;
    }

    this.verifyJsonWebToken(currentToken, function(response) {
        if (response && response.isValid) {
            if (callback) {
                callback(currentToken);
            }
        }
        else {
            this.validateAccessToken(function(responseObj) {
                if (callback) {
                    if (response) {
                        this.storeJsonWebToken(responseObj.jwtoken);
                        callback(this.getJsonWebToken());
                    }
                    else {
                        callback(null);
                    }
                }
            });
        }
    });
};
