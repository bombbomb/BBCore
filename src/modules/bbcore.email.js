/**
 * Retrieves a list of Emails from the current authenticated session
 * @arg {responseSuccess}   success
 */
BBCore.prototype.getEmails = function (success) {
    this.sendRequest({ method: "GetEmails" }, success);
};

/**
 * @typedef {object} customVideoEmailOptions
 */

/**
 *
 * @arg {customVideoEmailOptions} opts
 * @arg {responseSuccess} success
 */
BBCore.prototype.sendCustomVideoEmail = function (opts, success) {
    var defaults = {html_content: null, subject: '', email: '', email_id: '', from_name: ''};
    var parameters = $.extend({}, defaults, opts);
    this.sendRequest($.extend(parameters, {method: 'SendCustomVideoEmail'}), success);
};