
/**
 * This callback is displayed as a global member.
 * @callback responseSuccess
 * @param {Object} responseObject
 * @param {Object} [jqXHR]
 */

/**
 * reponseSuccess
 * @param responseObject
 * @param jqXHR
 */
function responseSuccess(responseObject,jqXHR){}

/** @namespace BBCore */

/**
 * @typedef {Object} contactProperties
 * @prop {string} email     Email Address
 * @prop {string} firstname First Name
 * @prop {string} lastname  Last Name
 * @prop {string} phone_number  Phone Number
 * @prop {string} address_line_1  Address 1
 * @prop {string} address_line_2  Address 2
 * @prop {string} city      City
 * @prop {string} state     State
 * @prop {string} country   Country`
 * @prop {string} postal_code  Postal Code
 * @prop {string} company   Company
 * @prop {string} position  Position
 * @prop {string} comments  Comments
 * @prop {string} listlist  Array of List Ids the Contact is subscribed to
 * @prop {string} id        Contact Id
 */

/**
 * Contact Object
 * @class BBCore.contact
 * @classdesc stuff
 * @property {string} email     Email Address
 * @property {string} firstname First Name
 * @property {string} lastname  Last Name
 * @property {string} phone_number  Phone Number
 * @property {string} address_line_1  Address 1
 * @property {string} address_line_2  Address 2
 * @property {string} city      City
 * @property {string} state     State
 * @property {string} country   Country`
 * @property {string} postal_code  Postal Code
 * @property {string} company   Company
 * @property {string} position  Position
 * @property {string} comments  Comments
 * @property {string} listlist  Array of List Ids the Contact is subscribed to
 * @property {string} id        Contact Id
 * @param {contactProperties} properties - {@link contactProperties}
 */
BBCore.contact = function (properties) {
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


/**
 * @typedef {object} videoProperties
 * @prop {string} vid_id
 * @prop {string} title
 * @prop {string} filename
 */


/**
 * @namespace BBCore.video
 * @class BBCore.video
 * @prop {string} vid_id
 * @prop {string} title
 * @prop {string} filename
 * @constructs
 * @param {videoProperties} properties
 */
BBCore.video = function (properties) {
    this.vid_id = "";
    this.title = "";
    this.filename = "";

    for (var prop in properties) {
        if (properties.hasOwnProperty(prop)) {
            this[prop] = properties[prop];
        }
    }

};


