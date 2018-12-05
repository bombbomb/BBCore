/*
 BombBomb's App Core API JS Implementation
 Copyright 2013-2016 BombBomb, Inc.
 Version 2.0
 */

/**
 * @typedef {Object} responseSuccess
 * @prop {string} status
 * @prop {string} method
 * @prop {Object} info
 */

/**
 * @typedef {Object} responseObject
 * @prop {string} status
 * @prop {string} method
 * @prop {Object} info
 */

/**
 * @typedef {Object} OAuthClientCredentials
 * @prop {string} clientIdentifier
 * @prop {string} clientSecret
 * @prop {string} redirectUri
 * @prop {string} type 'implicit' | 'authorization_code'
 */

/**
 @class
 @prop {string} userEmail
 @prop {string} userId
 @prop {string} clientId
 @prop {string} accessToken
 @prop {string} currentVideoId
 @prop {string} email
 @prop {string} onerror

 @constructs BBCore
 @param {Object} options
 @param {string} options.userEmail
 @param {string} options.userId
 @param {string} options.clientId
 @param {string} options.accessToken
 @param {string} options.currentVideoId
 @param {string} options.email
 @param {string} options.onerror
 @param {OAuthClientCredentials} options.credentials
 */

 // polyfill for Object.create.
 if (typeof Object.create !== "function") {
    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }
         if (typeof propertiesObject != 'undefined') {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");
        }
         function F() {}
        F.prototype = proto;
         return new F();
    };
}

function BBCore(options) {
    this.userEmail = "";
    this.userId = "";
    this.clientId = "";
    this.accessToken = "";
    this.currentVideoId = null;
    this.email = null;
    this.apiServer = null;
    this.credentials = { clientIdentifier: null, redirectUri: null, clientSecret: null, type: 'implicit' };
    this.onerror = null;

    this.__mergeProperties(null, options);

    // private properties
    this.authenticated = false;
    this.hasContext = false;
    this.storage = localStorage || window.storage;
    this.CONTENT = {QUICKSEND: ''};
    this.lastresponse = "";
    this.__vidRecording = false;
    this.__vidRecHndl = null;

    /** @class */
    this.contacts = function () {};
    this.contacts.prototype = Object.create(Array.prototype);
    this.contacts.constructor = this.contacts;
    /**
     * Adds a Contact {@link BBCore.contact} to Contacts collection
     * @param {contact} contact
     * @returns {contacts}
     */
    this.contacts.prototype.add = function (contact) {
        this.push(contact);
        return this;
    };
    /**
     * Returns the first matched contact from
     * @param {string} fieldName - Name of the field to search for the value
     * @param {string} value - Value to search for in the contacts
     * @returns {*|BBCore.contact}
     */
    this.contacts.prototype.find = function (fieldName, value) {
        for (var contact in this) {
            if (this.hasOwnProperty(contact) && contact[fieldName] === value) {
                return contact;
            }
        }
        return null;
    };
    this.contacts.prototype.get = function (contactId) {
        return this.find('id', contactId);
    };

    /**
     * @namespace BBCore.video
     * @class {Object} BBCore.videos
     */
    this.videos = function () {
    };
    this.videos.prototype = Object.create(Array.prototype);
    this.videos.constructor = this.videos;
    /**
     * Adds a Video to the collection
     * @param {video} video
     * @returns {videos}
     */
    this.videos.prototype.add = function (video) {
        this.push(video);
        return this;
    };

    // run initial methods
    if (this.accessToken) {
        this.validateAccessToken();
    }
    if (this.email && this.password) {
        this.login(this.email, this.password);
    }

}

/**
 @typedef {Object} BBCore.CONFIG
 @prop VERSION
 @prop API_END_POINT
 @prop SERVER_API_URL
 @constant
 */
BBCore.CONFIG =
{
    VERSION: "1.0",
    API_END_POINT: "/app/api/api.php",
    SERVER_API_URL: "https://app.bombbomb.com",
    OAUTH_STORAGE: 'authToken'
};

BBCore.prototype.__mergeProperties = function (base, addl) {
    if (!base)
    {
        base = this;
    }
    for (var prop in addl)
    {
        if (prop && addl.hasOwnProperty(prop))
        {
            base[prop] = (base[prop] && typeof base[prop] === 'object') ? this.__mergeProperties(base[prop],addl[prop]) : addl[prop];
        }
    }
    return base;
};

BBCore.prototype.onError = function (func_or_deet, xhr) {
    if (typeof func_or_deet === "function") {
        this.onerror = func_or_deet;
    } else {
        if (this.onerror) {
            this.onerror.call(this, func_or_deet, xhr);
        }
    }
};

BBCore.prototype.ver = function () {
    return BBCore.CONFIG.VERSION;
};


/** @class BBCore */

/**
 * This callback is displayed as a global member.
 * @callback responseSuccess
 * @param {Object} responseObject
 * @param {Object} [jqXHR]
 */

