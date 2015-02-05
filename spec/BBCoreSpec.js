//
// BBCore Video Tests
//
describe("A BBCore Video", function() {
    it("exists with a valid id", function() {
        var validVideoId = '11111111-1111-1111-1111-111111111111';
        var successCallback = jasmine.createSpy();
        var result = { status: "success", info: { video_id: validVideoId }};

        spyOn($, 'ajax').and.callFake(function(e) {
            e.success(result);
        });
        BBCore.prototype.getVideo(validVideoId, successCallback);

        expect(successCallback).toHaveBeenCalledWith(result);
    });

    it("doesn't exist for an invalid id", function() {
        var invalidVideoId = 'invalid video id';
        var successCallback = jasmine.createSpy();
        var result = { status: "failure", info: "error"};

        spyOn($, 'ajax').and.callFake(function(e) {
            e.success(result);
        });

        BBCore.prototype.getVideo(invalidVideoId, successCallback);

        expect(successCallback.calls.count()).toEqual(0);
    });

    it("isn't requested without a valid video id", function() {
        spyOn($, 'ajax');

        BBCore.prototype.getVideo(null, 'callback ignored');

        expect($.ajax.calls.count()).toEqual(0);
    });
});