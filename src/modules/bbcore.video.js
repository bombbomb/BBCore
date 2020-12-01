BBCore.prototype.getVideoDeliveryUrl = function (opts) {
    opts = {
      video_id: '',
      autoplay: 1,
      ...opts,
    };
    var sPrefix = (this.getServerUrl().indexOf('dev') > 0 ? 'dev.' : (this.getServerUrl().indexOf('local') > 0 ? 'local.' : ''));
    return 'http://' + sPrefix + 'bbemaildelivery.com/bbext/?p=video_land&id=' + opts.video_id + '&autoplay=' + opts.autoplay;
};

BBCore.prototype.getVideo = function (vidId, success) {
    if (!vidId) {
        return;
    }
    this.sendRequest({method: "GetVideos", video_id: vidId}, success);
};

BBCore.prototype.getVideos = function (options, success) {
    var defaults = {
        updatedSince: '',
        page: null,
        pageSize: 50
    };
    if (typeof options === "function") {
        success = options;
        options = {};
    }
    var parameters = { ...defaults, ...options };

    if (typeof parameters === "object" && parameters != null) {
        if (parameters.pageSize !== undefined) {
            if (parameters.pageSize == null || parameters.pageSize <= 0 || isNaN(parameters.pageSize)) {
                return false;
            }
        }
    }

    // TODO: Can we get away with just using GetVideosPaged?
    parameters.method = "GetVideos";
    if (parameters.page !== null && parameters.pageSize) {
        parameters.method = "GetVideosPaged";
    }
    this.sendRequest(parameters, success);
};

BBCore.prototype.getVideoStatus = function (vidId, success) {
    if (!vidId) {
        return;
    }
    this.sendRequest({method: "getVideoStatus", id: vidId}, success);
};

BBCore.prototype.getEncodingReport = function (vidId, success) {
    if (!vidId) {
        return;
    }
    this.sendRequest({method: "getEncodingReport", id: vidId}, success);
};

/**
 * Deletes a Video
 * @arg {string}            videoId
 * @arg {responseSuccess}   success
 */
BBCore.prototype.deleteVideo = function (videoId, success) {
    this.sendRequest({method: "DeleteVideo", videoId: videoId}, success);
};


BBCore.prototype.setVideoId = function (vid_id) {
    this.currentVideoId = vid_id;
};

BBCore.prototype.getVideoId = function (pcall) {
    if (!this.currentVideoId) {
        this.getNewVideoGuid(pcall);
    } else if (pcall) {
        pcall.call(this, this.currentVideoId);
    }
};

BBCore.prototype.hasVideoId = function () {
    return !!this.currentVideoId;
};

BBCore.prototype.getNewVideoGuid = function (pcall) {
    var inst = this;
    this.sendRequest({method: "GetVideoGuid"}, function (data) {
        inst.currentVideoId = data.info.video_id;
        if (pcall) {
            pcall.call(this, inst.currentVideoId);
        }
    });
};


/**
 *
 * @param {object} opts
 * @param {responseSuccess} onSuccess
 */
BBCore.prototype.videoQuickSend = function (opts, onSuccess) {
    // TODO; this should be calling the api
    var reqDetails = {
            method: 'VideoQuickSend',
            subject: 'QuickSend from BombBomb',
            mobile_message: '',
            email_address: null,
            videoId: null
        },
        sendErrors = [];

    for (var op in reqDetails) {
        if (reqDetails.hasOwnProperty(op)) {
            if (!opts[op]) {
                opts[op] = reqDetails[op];
            }
        }
    }

    if (opts.message && !opts.mobile_message) {
        opts.mobile_message = opts.message;
    }
    if (opts.email && !opts.email_address) {
        opts.email_address = opts.email;
    }
    if (opts.email_address && !opts.email_addresses) {
        opts.email_addresses = opts.email_address;
    }
    if (!opts.video_id && this.currentVideoId) {
        opts.video_id = this.currentVideoId;
        opts.videoId = this.currentVideoId;
    }

    // check options
    if (!opts.video_id) {
        sendErrors.push('quickSendVideo Error: no video_id defined.');
    }

    // TODO: should we attempt to send without specifying any email addresses?
    if (!opts.email_addresses) {
        sendErrors.push('quickSendVideo Error: no email_address defined.');
    }

    if (sendErrors.length > 0 && !opts.video_id) {
        this.getVideoId(function (guid) {
            if (guid) {
                opts.video_id = guid;
                this.sendRequest(opts, onSuccess);
            }
            else {
                sendErrors.push('quickSendVideo: Terminal Error: Unable to set video_id');
                this.onError({info: {errmsg: sendErrors}});
            }
        });
    }
    else {
        this.sendRequest(opts, onSuccess);
    }

};
