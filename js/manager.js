
function Manager(){

    var self = {};
    var byChar = {};
    var byPlayer = {};
    var byGame = {};
    var allVideos = [];

    self.manageVideo = function(video){
        allVideos.push(video);
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
        if (!(video.game in byGame)){
            byGame[video.game] = [];
        }
        byGame[video.game].push(video);
    }

    self.getCharacters = function(){
        return Object.keys(byChar);
    }

    self.getPlayers = function(){
        return Object.keys(byPlayer);
    }

    self.getVideosByCharacter = function(char){
        if (!(char in byChar)){
            return allVideos;
        }
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
        if (!(player in byPlayer)){
            return allVideos;
        }
        return byPlayer[player];
    }

    self.getVideos = function(game, player, char1, char2){
        var ag = self.getVideosByGame(game);
        var ap = self.getVideosByPlayer(player);
        var ac = self.getVideosByMatchup(char1, char2);
        return ag.filter(function(n) {
            return ap.indexOf(n) != -1;
        }).filter(function(n) {
            return ac.indexOf(n) != -1;
        });
    }

    self.getVideosByGame = function(game){
        return byGame[game];
    }

    return self;
}
