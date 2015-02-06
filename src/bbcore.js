/**
 @namespace
 @property {string} userEmail
 @property {string} userId
 @property {string} clientId
 @property {string} accessToken
 @property {string} currentVideoId
 @property {string} email
 @property {string} onerror
 */
function BBCore(properties) {

    /**
     * @typedef responseObject
     * @type {object}
     * @prop {string} status
     * @prop {object} info
     */

    /**
     * This callback is displayed as a global member.
     * @callback responseSuccess
     * @param {object} responseObject
     * @param {object} [jqXHR]
     */

    this.userEmail = "";
    this.userId = "";
    this.clientId = "";
    this.accessToken = "";
    this.currentVideoId = null;
    this.email = null;
    this.apiServer = null;
    this.onerror = null;

    for (var prop in properties) {
        if (properties.hasOwnProperty(prop)) {
            this[prop] = properties[prop];
        }
    }

    // private properties
    this.authenticated = false;
    this.hasContext = false;
    this.storage = localStorage || window.storage;
    this.CONTENT = {QUICKSEND: ''};
    this.lastresponse = "";
    this.__vidRecording = false;
    this.__vidRecHndl = null;

    this.contact = function (properties) {
        this.email = "";
        this.firstname = "";
        this.lastname = "";
        this.phone = "";
        this.phone_number = "";
        this.address_line_1 = "";
        this.address_line_2 = "";
        this.city = "";
        this.state = "";
        this.country = "";
        this.postal_code = "";
        this.company = "";
        this.position = "";
        this.comments = "";
        this.listlist = "";
        this.id = "";
        for (var prop in properties) {
            if (properties.hasOwnProperty(prop)) {
                this[prop] = properties[prop];
            }
        }
        this.eml = this.email;
    };

    this.contacts = function () {
    };
    this.contacts.prototype = Array.prototype;
    this.contacts.constructor = this.contacts;
    /**
     * add
     * @param {contact} contact
     * @returns {contacts}
     */
    this.contacts.prototype.add = function (contact) {
        this.push(contact);
        return this;
    };
    this.contacts.prototype.find = function (fieldName, value) {
        for (var property in this) {
            if (this.hasOwnProperty(property) && property[fieldName] === value) {
                return property;
            }
        }
        return null;
    };
    this.contacts.prototype.get = function (contactId) {
        return this.findContact('id', contactId);
    };

    this.video = function (properties) {
        this.vid_id = "";
        this.title = "";
        this.filename = "";

        for (var prop in properties) {
            if (properties.hasOwnProperty(prop)) {
                this[prop] = properties[prop];
            }
        }

    };

    this.videos = function () {
    };
    this.videos.prototype = Array.prototype;
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

BBCore.CONFIG =
{
    VERSION: "1.0",
    API_END_POINT: "/app/api/api.php",
    SERVER_API_URL: "https://app.bombbomb.com"
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

