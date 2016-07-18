
var Store = (function() {

    var self = {};

    var GITHUB_BASE = 'http://mpaulweeks.github.io/fgc-matchup/';
    var VIDEO_FILE = 'scala/data/video.json';

    function fix_file(file_url){
        if (TOOL.is_local && !TOOL.is_firefox){
            return GITHUB_BASE + file_url;
        }
        return file_url;
    }

    function parseJSON(data){
        var res = [];
        data.forEach(function (videoTuple){
            res.push(VideoItem(videoTuple));
        });
        return res;
    }

    self.load = function(callback){
        var videoFile = fix_file(VIDEO_FILE);
        $.getJSON(videoFile, function(data){
            var parsedVideos = parseJSON(data);
            callback(parsedVideos);
        });
    };

    return self;
})();
