/**
 *
 * @arg {object} opts
 * @arg {responseSuccess} success
 */
BBCore.prototype.getDrips = function (opts, success) {
    opts = opts || {};
    opts.method = "GetDrips";
    this.sendRequest(opts, success);
};

/**
 *
 * @arg {object} opts
 * @arg {responseSuccess} success
 */
BBCore.prototype.getForms = function (opts, success) {
    // implement this
    opts = opts || {};
    opts.method = "GetForms";
    // need to extend the getForms to the api end-point
    this.sendRequest(opts, success);
};


BBCore.prototype.getClientIntegrations = function (success) {
    this.sendRequest({method: "getClientIntegrations"}, success);
};