
var VideoManager = (function(){

    var self = {};
    var byGame = {};

    self.currentGameId = null;

    self.manageVideo = function(video){
        if (!(video.game.id in byGame)){
            byGame[video.game.id] = {
                videos: [],
                byChar: {},
                byPlayer: {}
            };
        }
        var gameObj = byGame[video.game.id];
        gameObj.videos.push(video);
        var byChar = gameObj.byChar;
        video.characters.forEach(function (char){
            if (!(char.id in byChar)){
                byChar[char.id] = [];
            }
            byChar[char.id].push(video);
        });
        var byPlayer = gameObj.byPlayer;
        video.players.forEach(function (player){
            if (!(player.id in byPlayer)){
                byPlayer[player.id] = [];
            }
            byPlayer[player.id].push(video);
        });
    }

    function currentGame(){
        return byGame[self.currentGameId];
    }

    self.getCharacters = function(){
        var charItems = [];
        for (var charId in currentGame().byChar){
            charItems.push(CharacterManager.get(charId));
        }
        return TOOL.sortById(charItems);
    }

    self.getPlayers = function(){
        var playerItems = [];
        for (var playerId in currentGame().byPlayer){
            playerItems.push(PlayerManager.get(playerId));
        }
        return TOOL.sortById(playerItems);
    }

    self.getGames = function(){
        var gameItems = [];
        for (var gameId in byGame){
            gameItems.push(GameManager.get(gameId));
        }
        return gameItems;
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
        var ap = getVideosByPlayer(self.currentGameId, player);
        var ac = getVideosByMatchup(self.currentGameId, char1, char2);
        return ap.filter(function(n) {
            return ac.indexOf(n) != -1;
        });
    };

    return self;
})();
