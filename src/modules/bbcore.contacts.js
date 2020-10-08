/**
 * Retrieves Contact Lists
 * @arg {responseSuccess}   success
 */
BBCore.prototype.getLists = function (success) {
    this.sendRequest({method: "GetLists"}, success);
};

/**
 * Creates a Contact List and returns the Guid
 * @arg {string}            listName
 * @arg {responseSuccess}   success
 */
BBCore.prototype.createList = function (listName, success) {
    this.sendRequest({method: "createList", name: listName}, success);
};

/**
 * Retrieves a Contact
 * @arg {string}          contactId
 * @arg {responseSuccess} success
 */
BBCore.prototype.getContact = function (contactId, success) {
    if (!contactId) {
        return;
    }
    var defaults = {width: 340, force_ssl: false};
    var parameters = {
      ...defaults,
      contact_id: contactId,
      method: 'GetContact',
    };
    this.sendRequest(parameters, success);
};

/**
 * Retrieves Contacts from a Contact List
 * @arg {string}          listId
 * @arg {responseSuccess} success
 */
BBCore.prototype.getListContacts = function (listId, success) {
    if (!listId) {
        return;
    }
    this.sendRequest({method: "GetListContacts", list_id: listId}, success);
};

/**
 * Adds a Contact to a Contact List
 * @arg {contact}         contact
 * @arg {responseSuccess} success
 */
BBCore.prototype.addContact = function (contact, success) {
    if (typeof contact === "object") {
        //combine the contact object into a request object
        contact.method = "AddContact";
        this.sendRequest(contact, success);
    }
};

/**
 * Adds a batch of Contacts
 * @arg {object}          opts
 * @arg {responseSuccess} success
 */
BBCore.prototype.bulkAddContacts = function (opts, success) {
    if (!opts) {
        opts = {};
    }
    opts.method = "BulkAddContacts";
    if (typeof opts.contacts === "object") {
        opts.contacts = JSON.stringify(opts.contacts);
    }

    this.sendRequest(opts, success);
};

/**
 *
 * @arg {object} opts
 * @arg {responseSuccess} success
 */
BBCore.prototype.updateContact = function (opts, success) {
    if (!opts) {
        return;
    }

    opts.method = "UpdateContact";
    this.sendRequest(opts, success);
};

/**
 * Retrieves an Import Address by a Type
 * @param opts
 * @param {responseSuccess} success
 */
BBCore.prototype.getImportAddressesByType = function (opts, success) {
    opts = {
      ...opts,
      method: 'getImportAddressesByType',
    };
    if (!opts.type) {
        this.onError({info: {errmsg: ['A Type must be provided.']}});
    }
    this.sendRequest(opts, success);
};

/**
 * Retrieves an Import Address by a Type
 * @param {object} opts
 * @param {responseSuccess} success
 */
BBCore.prototype.addContactImportAddress = function (opts, success) {
    opts = {
      opts,
      method: 'addContactImportAddress'
    };
    if (!opts.importAddrCode || !opts.importAddrName) {
        this.onError({info: {errmsg: ['An Import Address Code and Import Address Name must be provided.']}});
    }
    this.sendRequest(opts, success);
};

BBCore.prototype.deleteContactImportAddress = function (opts, success) {
    opts = {
      ...opts,
      importAddrCode: 1,
      method: 'deleteContactImportAddress',
    };
    if (!opts.importAddrCode) {
        this.onError({info: {errmsg: ['Invalid Import Address Code']}});
    }
    this.sendRequest(opts, success);
};

/**
 * @typedef {object} getClientInteractionOptions
 * @prop {string} [activitySince] DateTime
 */

/**
 * Retrieves a list of re
 * @param {getClientInteractionOptions} opts
 * @param {responseSuccess} success
 */
BBCore.prototype.getClientRecentInteractions = function (opts, success) {
    opts = opts || {};
    opts.activitySince = opts.activitySince || '';
    opts.method = "GetClientRecentInteractions";
    this.sendRequest(opts, success);
};
