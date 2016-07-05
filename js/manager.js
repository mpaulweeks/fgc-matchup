
function Manager(){

    var self = {};
    var byChar = {};
    var byPlayer = {};
    self.allVideos = [];

    self.manageVideo = function(video){
        video.characters.forEach(function (char){
            if (!(char in byChar)){
                byChar[char] = [];
            }
            byChar[char].push(video);
        });
        video.players.forEach(function (player){
            if (!(player in byPlayer)){
                byPlayer[player] = [];
            }
            byPlayer[player].push(video);
        });
        self.allVideos.push(video);
    }

    self.getVideosByCharacter = function(char){
        return byChar[char];
    }

    self.getVideosByMatchup = function(char1, char2){
        var a1 = self.getVideosByCharacter(char1);
        var a2 = self.getVideosByCharacter(char2);
        return a1.filter(function(n) {
            return a2.indexOf(n) != -1;
        });
    }

    self.getVideosByPlayer = function(player){
        return byPlayer[player];
    }

    return self;
}
