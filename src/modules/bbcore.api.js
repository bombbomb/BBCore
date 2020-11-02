/**
 *
 * @returns {BBCore.apiServer|*|BBCore.CONFIG.SERVER_API_URL}
 */
BBCore.prototype.getServerUrl = function () {
    return this.apiServer || BBCore.CONFIG.SERVER_API_URL;
};

/**
 * Returns the fully qualified URL for BB API
 * @returns {string}
 */
BBCore.prototype.getRequestUrl = function () {
    return this.getServerUrl() + BBCore.CONFIG.API_END_POINT;
};

/**
 * @typedef {object} requestParameters
 * @prop {string} [method]
 * @prop {string} [api_key]
 * @prop {string} [async]
 * @prop {string} [url]
 * @prop {string} [url]
 */

 BBCore._addParameterToUrl = function (urlString, parameterKey, parameterValue) {
    var separator = '?';
    if(urlString.indexOf('?') !== -1) {
        separator = '&'
    }
    return urlString + separator + parameterKey + "=" + parameterValue;
 }

/**
 * Sends a request to the specified method of the [BombBomb API](//bombbomb.com/api)
 * @arg {string}                        method The method name to call
 * @arg {requestParameters} [params]    The parameters to send with the request
 * @arg {responseSuccess}   [success]   A callback when the request succeeds
 * @arg {responseSuccess}   [error]     A callback when the request fails
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

    if (typeof method === 'string' && !params.method) {
        params.method = method;
    }

    if (method !== "IsValidLogin" && !params.api_key) {
        params.api_key = this.getKey();
    }
    if ((method !== "ValidateSession" && params.grant_type !== "authorization_code") && !this.authenticated) {
        this.onError.call(this, {
            status: 'failure',
            methodName: 'InvalidSession',
            info: { errormsg: 'Invalid login' }
        }, null);
        return false;
    }

    var requestHeaders = {};
    var inst = this;
    var asyncSetting = true;
    if (typeof params.async !== 'undefined') {
        asyncSetting = params.async;
    }

    var requestToken = this.getOAuthTokenForRequest();
    if (requestToken && requestToken.length)
    {
        requestHeaders['Authorization'] = requestToken;
        typeof params.api_key !== 'undefined' && delete params.api_key
    }
    else if(this.isAccessToken(params.api_key)) {
        requestHeaders['Authorization'] = params.api_key;
        delete params.api_key;
    }
    var url = params.url ? params.url : this.getRequestUrl();
    url = BBCore._addParameterToUrl(url, 'xsrc', 'bbcore-' + BBCore.CONFIG.VERSION);

    let formData = new FormData();
    Object.keys(params).forEach(key => {
      formData.append(key, params[key])
    })

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, asyncSetting)
    Object.keys(requestHeaders).forEach(headerKey => {
      xhr.setRequestHeader(headerKey, requestHeaders[headerKey]);
    })

    xhr.onload = (result) => {
      const res = JSON.parse(result.target.response);
      if(xhr.readyState === 4 && xhr.status === 200) {
        if (res.status === "success") {
            // if the result returned a
            if (method === "GetVideoGuid" && res.info && res.info.video_id) {
                inst.currentVideoId = res.info.video_id;
            }
            if (success) {
                success.call(inst, res);
            }
        } else if ((params.grant_type === "authorization_code" || params.grant_type === "refresh_token")) {
            success.call(inst, res);
        } else {
            inst.onError.call(inst, res);
        }
      } else {
        // non-200 status code
        inst.onError.call(inst, res);
      }
    };
    
    xhr.onerror = (jqXHR)  => {
      let resp = {
        status: 'unknown',
        jqXHR: jqXHR,
      };
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
    };

    xhr.send(formData)

};
