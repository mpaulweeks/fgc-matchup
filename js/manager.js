
function Manager(){

    var self = {};
    var byGame = {};

    self.currentGame = null;

    self.manageVideo = function(video){
        if (!(video.game in byGame)){
            byGame[video.game] = {
                videos: [],
                byChar: {},
                byPlayer: {}
            };
        }
        var gameObj = byGame[video.game];
        gameObj.videos.push(video);
        var byChar = gameObj.byChar;
        video.characters.forEach(function (char){
            if (!(char in byChar)){
                byChar[char] = [];
            }
            byChar[char].push(video);
        });
        var byPlayer = gameObj.byPlayer;
        video.players.forEach(function (player){
            if (!(player.id in byPlayer)){
                byPlayer[player.id] = [];
            }
            byPlayer[player.id].push(video);
        });
    }

    self.getCharacters = function(){
        return TOOL.sort(Object.keys(byGame[self.currentGame].byChar));
    }

    self.getPlayers = function(){
        return TOOL.sort(Object.keys(byGame[self.currentGame].byPlayer));
    }

    self.getGames = function(){
        return Object.keys(byGame);
    }

    function getVideosByCharacter(game, char){
        var byChar = byGame[game].byChar;
        if (!(char in byChar)){
            return byGame[game].videos;
        }
        return byChar[char];
    }

    function getVideosByMatchup(game, char1, char2){
        if (char1 && char2 && char1 == char2){
            var am = getVideosByCharacter(game, char1);
            return am.filter(function(n) {
                return n.isMirror(char1);
            });
        }
        var a1 = getVideosByCharacter(game, char1);
        var a2 = getVideosByCharacter(game, char2);
        return a1.filter(function(n) {
            return a2.indexOf(n) != -1;
        });
    }

    function getVideosByPlayer(game, player){
        var byPlayer = byGame[game].byPlayer;
        if (!(player in byPlayer)){
            return byGame[game].videos;
        }
        return byPlayer[player];
    }

    self.getVideos = function(player, char1, char2){
        var ap = getVideosByPlayer(self.currentGame, player);
        var ac = getVideosByMatchup(self.currentGame, char1, char2);
        return ap.filter(function(n) {
            return ac.indexOf(n) != -1;
        });
    };

    return self;
}
