// returns the url for the embedded video recorder, typically used for iframes
BBCore.prototype.getEmbeddedRecorderUrl = function (opts, comp) {
    if (typeof opts === "function") {
        comp = opts;
    }
    var defOpts = {height: 240, width: 340, force_ssl: false};
    if (typeof opts.height === 'undefined') {
        opts = defOpts;
    }

    var reqParams = $.extend({}, opts, {
        module: 'videos',
        page: 'EmbeddedRecorder',
        popup: 1,
        nohtml: 1,
        api_key: this.getKey()
    });
    var inst = this;
    this.getVideoId(function (vidId) {
        var fda = inst.getServerUrl() + '/app/?module=login&actn=login&api_key=' + inst.getKey() + '&redir=' + btoa(inst.getServerUrl() + '/app/?' + $.param(reqParams) + (vidId ? '&vguid=' + vidId : ''));
        comp.call(this, {url: fda, video_id: vidId});
    });

};

BBCore.prototype.getVideoRecorder = function (opts, comp) {
    if (typeof opts === "function") {
        comp = opts;
        opts = null;
    }
    var defOpts = {height: 240, width: 340, force_ssl: false, start: null, stop: null, recorded: null};
    opts = opts || {};
    $.extend(opts, defOpts);
    if (!this.isAuthenticated()) {
        this.onError({message: "Must authenticate session before invoking methods."});
        return;
    }
    opts.method = "GetVideoRecorder";

    // TODO; might be good to set the video id before passing to success execution
    // TODO; may need to inject the recorder event calls binding back to the API

    this.sendRequest(opts, function (response) {
        console.log('GetVideoRecorder returned, calling callback');
        console.log(comp);
        if (comp) {
            comp.call(this, response);
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
        width: 340,
        force_ssl: false,
        recorderLoaded: null,
        recordComplete: recordComplete
    };
    //for (var op in defOpts) opts[op] = defOpts[op];
    opts = opts || defOpts;

    if (opts.recordComplete && !recordComplete) {
        recordComplete = opts.recordComplete;
    }
    this.__vidRecHndl = opts.target ? $(opts.target) : $('body').append('<div id="b2recorder"></div>');

    var rec_opts = opts;
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
        inst.__vidRecHndl.html(data.info.content);
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


BBCore.prototype.saveRecordedVideo = function (title, video_id, vfilename, success) {
    var vidId = video_id || this.currentVideoId;
    var inst = this;
    this.sendRequest({
        method: 'VideoRecordedLive',
        title: title,
        filename: vfilename,
        vid_id: vidId
    }, function (data) {
        success.call(inst, data);
    });
};


BBCore.prototype.saveRecording = function (opts) {
    var pVals = opts;
    if (!pVals.vid_id) {
        return;
    }
    this.sendRequest({method: "VideoRecordedLive"}, pVals, function () {
    });
};