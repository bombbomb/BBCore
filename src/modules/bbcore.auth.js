/**
 *
 * @arg {string} uid
 * @arg {string} pwd
 * @arg {responseSuccess} success
 */
BBCore.prototype.login = function (uid, pwd, success) {
    if (typeof uid === "function") {
        success = uid;
        uid = this.storage.getItem('b2-uid');
        pwd = this.storage.getItem('b2-pwd');
    }

    if (!uid) {
        return;
    }

    this.userEmail = uid;

    var inst = this;
    this.sendRequest({method: "ValidateSession", email: uid, pw: pwd}, function (respObj) {
        inst.__updateSession(respObj, success);
    });
};

BBCore.prototype.logout = function () {
    this.storage.removeItem('b2-uid');
    this.storage.removeItem('b2-pwd');
    this.storage.removeItem('access_token');
    this.hasContext = false;
    this.authenticated = false;
};

/**
 * Returns bool for whether or not a prior authentication is stored locally
 * @returns {boolean}
 */
BBCore.prototype.credentialsSaved = function () {
    return null !== this.storage.getItem("b2-uid") || null !== this.storage.getItem("access_token");
};

/**
 * Save credentials to local storage (not recommended)
 * @arg {string} uid - User ID/Email Address
 * @param {string} pwd - Password
 */
BBCore.prototype.saveCredentials = function (uid, pwd) {
    this.storage.setItem("b2-uid", uid);
    this.storage.setItem("b2-pwd", pwd);
};

/**
 * Authenticates from previously stored credentials
 * @arg {responseSuccess} success
 * @arg {responseSuccess} err
 */
BBCore.prototype.resumeStoredSession = function (success, err) {
    this.accessToken = this.storage.getItem("access_token");
    if (this.accessToken) {
        this.validateAccessToken(success);
    }
    else if (this.storage.getItem("b2-uid")) {
        this.login(success);
    }
    else {
        err();
    }
};

BBCore.prototype.validateAccessToken = function (done) {
    var inst = this;
    this.sendRequest({method: "ValidateSession", api_key: this.accessToken, async: false}, function (respObj) {
        inst.__updateSession(respObj, done);
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

BBCore.prototype.invalidateSession = function () {
    var that = this;
    this.sendRequest({method: "invalidateKey"}, function () {
        that.clearKey();
        that.accessToken = "";
        that.authenticated = false;
        that.hasContext = false;
    });
};

BBCore.prototype.__updateSession = function (respObj, done) {
    if (respObj.status === "success") {
        this.userId = respObj.info.user_id;
        this.clientId = respObj.info.client_id;
        this.accessToken = respObj.info.api_key;
        this.hasContext = true;
        this.authenticated = true;

        this.storeKey(this.accessToken);

        // TODO; send request to fetch and update user details

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
        if (!complete) {
            complete({isValid: (resp.status === "success")});
        }
    });
};

/**
 * @arg key
 */
BBCore.prototype.storeKey = function (key) {
    // TODO: Are the conditionals there to check for an authenticated user?
    if (this.accessToken) {
        this.accessToken = key;
    }

    if (!this.accessToken) {
        return;
    }
    // currently this will use the API Key, in the future this should be updated to use a key which can be expired
    this.storage.setItem("access_token", this.accessToken);
};

BBCore.prototype.getKey = function () {
    return this.accessToken;
};
BBCore.prototype.clearKey = function () {
    // TODO: should the accessToken property be reset as well?
    this.storage.removeItem('access_token');
};