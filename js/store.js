
var Store = (function() {

    var self = {};

    var VIDEO_FILE = 'scala/data/video.json';

    function parseJSON(data){
        var res = [];
        data.forEach(function (videoTuple){
            res.push(VideoItem(videoTuple));
        });
        return res;
    }

    self.load = function(callback){
        $.getJSON(VIDEO_FILE, function(data){
            var parsedVideos = parseJSON(data);
            callback(parsedVideos);
        });
    };

    return self;
})();
