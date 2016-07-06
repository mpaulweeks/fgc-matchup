
function Manager(){

    var self = {};
    var byGame = {};

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
            if (!(player in byPlayer)){
                byPlayer[player] = [];
            }
            byPlayer[player].push(video);
        });
    }

    self.getCharacters = function(game){
        return Object.keys(byGame[game].byChar);
    }

    self.getPlayers = function(game){
        return Object.keys(byGame[game].byPlayer);
    }

    self.getGames = function(){
        return Object.keys(byGame);
    }

    self.getVideosByCharacter = function(game, char){
        var byChar = byGame[game].byChar;
        if (!(char in byChar)){
            return byGame[game].videos;
        }
        return byChar[char];
    }

    self.getVideosByMatchup = function(game, char1, char2){
        var a1 = self.getVideosByCharacter(game, char1);
        var a2 = self.getVideosByCharacter(game, char2);
        return a1.filter(function(n) {
            return a2.indexOf(n) != -1;
        });
    }

    self.getVideosByPlayer = function(game, player){
        var byPlayer = byGame[game].byPlayer;
        if (!(player in byPlayer)){
            return byGame[game].videos;
        }
        return byPlayer[player];
    }

    self.getVideos = function(game, player, char1, char2){
        var ag = self.getVideosByGame(game);
        var ap = self.getVideosByPlayer(game, player);
        var ac = self.getVideosByMatchup(game, char1, char2);
        return ag.filter(function(n) {
            return ap.indexOf(n) != -1;
        }).filter(function(n) {
            return ac.indexOf(n) != -1;
        });
    }

    self.getVideosByGame = function(game){
        return byGame[game].videos;
    }

    return self;
}
