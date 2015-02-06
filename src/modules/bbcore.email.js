/**
 * Retrieves a list of Email
 * @arg {string}            listName
 * @arg {responseSuccess}   success
 */
BBCore.prototype.getEmails = function (success) {
    this.sendRequest({method: "GetEmails"}, success);
};


BBCore.prototype.sendCustomVideoEmail = function (opts, success) {
    var defaults = {html_content: null, subject: '', email: '', email_id: '', from_name: ''};
    var parameters = $.extend({}, defaults, opts);
    this.sendRequest($.extend(parameters, {method: 'SendCustomVideoEmail'}), success);
};