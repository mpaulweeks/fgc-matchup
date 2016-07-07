
function Store() {

    var self = {};

    var GITHUB_BASE = 'http://mpaulweeks.github.io/fgc-matchup/';
    var YOGAFLAME_FILE = 'scala/data/YogaFlame24.json';
    var OLYMPIC_FILE = 'scala/data/TubeOlympicGaming.json';

    function fix_file(file_url){
        if (TOOL.is_local && !TOOL.is_firefox){
            return GITHUB_BASE + file_url;
        }
        return file_url;
    }

    self.load = function(callback){
        var yogaflame_file = fix_file(YOGAFLAME_FILE);
        var olympic_file = fix_file(OLYMPIC_FILE);
        var parsedVideos = [];
        $.getJSON(yogaflame_file, function(data){
            parsedVideos = parsedVideos.concat(parseJSON(data, YogaFlameParser().parse));
            $.getJSON(olympic_file, function (data){
                parsedVideos = parsedVideos.concat(parseJSON(data, OlympicParser().parse));
                callback(parsedVideos);
            });
        });
    };

    return self;
}
