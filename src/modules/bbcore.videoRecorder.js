// returns the url for the embedded video recorder, typically used for iframes
/**
 *
 * @param {Object} [options]
 * @param {Function} onComplete
 */
BBCore.prototype.getEmbeddedRecorderUrl = function (options, onComplete) {
    if (typeof options === "function") {
        onComplete = options;
        options = {};
    }

    var defOpts = {height: 240, width: 320, force_ssl: false};
    if (typeof options.height === 'undefined') {
      options = {
        ...defOpts,
        ...options,
      }
    }

    var reqParams = {
      ...options,
      module: 'videos',
      page: 'EmbeddedRecorder',
      popup: 1,
      nohtml: 1
    };
    var inst = this;

    this.getVideoId(function (vidId) {
        var embeddedVideoRecorderUrl = inst.getServerUrl() + '/app/?',
            legacyToken = inst.getKey()
            // if a legacy token is set, but we don't want to trigger login functionality...
            ignoreLegacyToken = options.ignoreLegacyToken || false;
        if (legacyToken && legacyToken.length && !ignoreLegacyToken)
        {
            reqParams.api_key = legacyToken;
            embeddedVideoRecorderUrl += 'module=login&actn=login&api_key=' + legacyToken +
              '&redir=' + btoa(embeddedVideoRecorderUrl +
              Object.keys(reqParams).map(key => key + '=' + encodeURIComponent(reqParams[key])).join('&') +
              (vidId ? '&vguid=' + vidId : ''));
            onComplete.call(this, {url: embeddedVideoRecorderUrl, video_id: vidId});
        }
        else
        {
            options.videoId = vidId;
            this.getVideoRecorder(options, function(data){
                var recorderUrl = '';
                if (data && data.info && data.info.content.length)
                {
                    var recMatchUrl =  /https*:\/\/[^<"]+/.exec(data.info.content);
                    recorderUrl = recMatchUrl[0];
                }
                onComplete({ url: recorderUrl, video_id: vidId });
            });
        }
    });

};

/**
 *
 * @param {object} opts
 * @param {Function} onComplete
 */
BBCore.prototype.getVideoRecorder = function (opts, onComplete) {
    if (typeof opts === "function") {
        onComplete = opts;
        opts = null;
    }
    var defOpts = {height: 240, width: 320, force_ssl: false, start: null, stop: null, recorded: null};

    mergedOpts = {
      ...defOpts,
      ...opts
    };

    if (!this.isAuthenticated()) {
        this.onError({message: "Must authenticate session before invoking methods."});
        return;
    }
    mergedOpts.method = "GetVideoRecorder";

    // TODO; might be good to set the video id before passing to success execution
    // TODO; may need to inject the recorder event calls binding back to the API

    this.sendRequest(mergedOpts, function (response) {
        if (onComplete) {
            onComplete.call(this, response);
        }
    });

};

// TODO; COULD MERGE with getVideoRecorder if the default options included, stop, start, recorded parameters
BBCore.prototype.startVideoRecorder = function (opts, recordComplete) {
    if (typeof opts === "function") {
        recordComplete = opts;
        opts = null;
    }
    var defOpts = {
        type: 'embedded',
        target: null,
        height: 240,
        width: 320,
        force_ssl: false,
        recorderLoaded: null,
        recordComplete: recordComplete
    };

    opts = opts || defOpts;

    if (opts.recordComplete && !recordComplete) {
        recordComplete = opts.recordComplete;
    }

    if (opts.target) {
      this.__vidRecHndl =  document.querySelector(opts.target)
    } else {
      const elem = document.createElement('div');
      elem.id = 'b2recorder'
      this.__vidRecHndl = document.querySelector('body').appendChild(elem);
    }

    var rec_opts = { ...opts };
    delete rec_opts.type;
    delete rec_opts.target;
    delete rec_opts.recordComplete;
    delete rec_opts.recorderLoaded;

    var inst = this;
    // get recorder and inject into target
    this.getVideoRecorder(rec_opts, function (data) {
        if (!inst.currentVideoId && data.info.vid_id) {
            inst.currentVideoId = data.info.vid_id;
        }

        console.log('startVideoRecorder :' + inst.currentVideoId);
        inst.__vidRecHndl.innerHTML = data.info.content;

        if (opts.recorderLoaded) {
            opts.recorderLoaded.call(inst, data.info);
        }
    });

    // add the callbacks for the recorder to this instance calls.
    window.bbStreamStartRecord = function (strname, flname) {
        console.log('bbStreamStartRecord triggered');
        inst.liveStreamStartRecord.call(inst, strname, flname);
    };
    window.bbStreamStopRecord = function (strname) {
        console.log('bbStreamStopRecord triggered');
        inst.liveStreamStopRecord.call(inst, strname);
    };

    window.reportVideoRecorded = function (flname, log) {
        console.log('reportVideoRecorded triggered');
        recordComplete({videoId: inst.currentVideoId, filename: flname, log: log});
    };
};

BBCore.prototype.destroyVideoRecorder = function () {
    if (typeof this.__vidRecHndl !== 'undefined') {
        this.__vidRecHndl.remove();
    }
    window.bbStreamStartRecord = null;
    window.bbStreamStopRecord = null;
    window.reportVideoRecorded = null;
};

BBCore.prototype.liveStreamStartRecord = function (streamname, filename) {
    this.__vidRecording = true;
    this.sendRequest({method: 'liveStreamStartRecord', streamname: streamname, filename: filename});
};

BBCore.prototype.liveStreamStopRecord = function (streamname) {
    this.__vidRecording = false;
    this.sendRequest({method: 'liveStreamStopRecord', streamname: streamname});
};

/**
 *
 * @param {string} title
 * @param {string} videoId
 * @param {string} videoFilename
 * @param {Function} success
 */
BBCore.prototype.saveRecordedVideo = function (title, videoId, videoFilename, success) {
    var vidId = videoId || this.currentVideoId;
    var inst = this;
    this.sendRequest({
        method: 'VideoRecordedLive',
        title: title,
        filename: videoFilename,
        vid_id: vidId
    }, function (data) {
        success.call(inst, data);
    });
};

/**
 * @class videoOptions
 * @prop {string} vid_id
 */

/**
 *
 * @param {Object} options
 */
BBCore.prototype.saveRecording = function (options) {
    var pVals = options;
    if (!pVals.vid_id) {
        return;
    }
    this.sendRequest({method: "VideoRecordedLive"}, pVals, function () {
    });
};
