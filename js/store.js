
function Store() {

    var self = {};

    var YOGAFLAME_FILE = 'scala/data/YogaFlame24.json';
    var GITHUB_BASE = 'http://mpaulweeks.github.io/fgc-matchup/';

    function fix_file(file_url){
        if (TOOL.is_local && !TOOL.is_firefox){
            return GITHUB_BASE + file_url;
        }
        return file_url;
    }

    self.load = function(callback){
        var yogaflame_file = fix_file(YOGAFLAME_FILE);
        $.getJSON(yogaflame_file, function(data){
            var parsedVideos = parseJSON(data, YogaFlameParser().parse);
            callback(parsedVideos);
        });
    };

    return self;
}
