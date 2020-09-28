/**
 * Retrieves a list of Emails from the current authenticated session
 * @arg {responseSuccess}   success
 */
BBCore.prototype.getEmails = function (success) {
    this.sendRequest({ method: "GetEmails" }, success);
};

/**
 * @typedef {object} customVideoEmailOptions
 * @prop {string} from_name
 * @prop {string} email_id
 * @prop {string} email
 * @prop {string} subject
 * @prop {string} html_content
 */

/**
 *
 * @arg {customVideoEmailOptions} opts
 * @arg {Function} success
 */
BBCore.prototype.sendCustomVideoEmail = function (opts, success) {
    var defaults = {method: 'SendCustomVideoEmail', html_content: null, subject: '', email: '', email_id: '', from_name: ''};
    var parameters = { ...defaults, ...opts };
    this.sendRequest(parameters, success);
};
