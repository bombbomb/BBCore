
BBCore.prototype.getServerUrl = function () {
    return this.apiServer || BBCore.CONFIG.SERVER_API_URL;
};

BBCore.prototype.getRequestUrl = function () {
    return this.getServerUrl() + BBCore.CONFIG.API_END_POINT;
};


/**
 * Sends a request to the specified method of the [BombBomb API](//bombbomb.com/api)
 * @arg {string}          method The method name to call
 * @arg {array}           params The parameters to send with the request
 * @arg {responseSuccess} success A callback when the request succeeds
 * @arg {responseSuccess} error A callback when the request fails
 */
BBCore.prototype.sendRequest = function (method, params, success, error) {
    if (typeof params === "function") {
        success = params;
    }
    if (typeof method === "object") {
        params = method;
    }
    if (typeof method === "object" && params.method) {
        method = params.method;
    }

    if (method !== "IsValidLogin" && !params.api_key) {
        params.api_key = this.accessToken;
    }
    if (method !== "ValidateSession" && !this.authenticated) {
        this.onError.call(this, {
            status: 'failure',
            methodName: 'InvalidSession',
            info: { errormsg: 'Invalid login' }
        }, null);
        return false;
    }

    var inst = this;

    var asyncSetting = true;
    if (typeof params.async !== 'undefined') {
        asyncSetting = params.async;
    }

    return $.ajax({
        url: params.url ? params.url : this.getRequestUrl(), //BBCore.CONFIG.SERVER_API_URL + BBCore.CONFIG.API_END_POINT,
        async: asyncSetting,
        type: "post",
        dataType: "json",
        /*
         xhrFields: {
         withCredentials: true
         },
         */
        crossDomain: true,
        data: params,
        success: function (result) {
            // set state of bb instance
            // ?? could evaluate the two last statuses and
            inst.lastresponse = result.status;
            if (result.status === "success") {
                // if the result returned a
                if (method === "GetVideoGuid" && result.info && result.info.video_id) {
                    this.currentVideoId = result.info.video_id;
                }
                if (success) {
                    success.call(inst, result);
                }
            }
            else {
                inst.onError.call(inst, result);
            }
        },
        error: function (jqXHR) {
            var resp = {status: 'unknown', jqXHR: jqXHR};
            if (typeof jqXHR.responseJSON !== 'undefined') {
                resp = jqXHR.responseJSON;
            }
            inst.lastresponse = resp.status;
            if ("success" === resp.status) {
                success.call(inst, resp, jqXHR);
            } else {
                inst.onError.call(inst, resp, jqXHR);
            }

            if (error) {
                error(inst, resp);
            }
        }
    });
};


