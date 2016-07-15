
function VideoItem(
    timestamp,
    id,
    title,
    gameId,
    characterTuples,
    playerNames)
{
    var self = {};

    self.game = GameManager.get(gameId);
    var date = timestamp.split('T')[0];
    var allChars = {};
    var playerCharacters = [[],[]];
    for (var i = 0; i < 2; i++){
        var charTuple = characterTuples[i];
        charTuple.forEach(function (char){
            var charItem = CharacterManager.new(char);
            allChars[charItem.id] = charItem;
            playerCharacters[i].push(charItem);
        });
    }
    self.characters = [];
    for (var charId in allChars){
        if (allChars.hasOwnProperty(charId)) {
            self.characters.push(allChars[charId]);
        }
    }
    self.playerNames = playerNames;
    self.players = function(){
        var playerItems = [];
        playerNames.forEach(function (playerName){
            playerItems.push(PlayerManager.new(self.game.id, playerName));
        });
        return playerItems;
    };

    self.isMirror = function(char){
        // check if both player's rosters contain char
        return characterSets[0].has(char) && characterSets[1].has(char);
    }

    var youtubeLink = '<a class="external" target="_blank" href="https://youtu.be/{1}">{2}</a>';
    var playerClass = 'link-player';
    var characterClass = 'link-character';

    function characterLinks(index){
        var playerCharLinks = []
        playerCharacters[index].forEach(function (charItem){
            playerCharLinks.push(TOOL.internalLink(characterClass, charItem));
        });
        return playerCharLinks.join(', ');
    }

    self.toData = function(){
        var playerItems = self.players();
        return [
            TOOL.format(youtubeLink, id, date),
            TOOL.internalLink(playerClass, playerItems[0]),
            characterLinks(0),
            TOOL.internalLink(playerClass, playerItems[1]),
            characterLinks(1),
        ];
    }

    return self;
}

var VideoManager = (function(){

    var self = {};
    var byGame = {};
    var allVideos = [];

    self.currentGameId = null;

    self.organize = function(allVideos){
        var playerNamesByGame = {};
        allVideos.forEach(function (video){
            if (!(video.game.id in playerNamesByGame)){
                playerNamesByGame[video.game.id] = [];
            }
            video.playerNames.forEach(function (playerName){
                playerNamesByGame[video.game.id].push(playerName);
            })
        });
        Object.keys(playerNamesByGame).forEach(function (gameId){
            PlayerManager.organize(gameId, playerNamesByGame[gameId]);
        });
        allVideos.forEach(function (video){
            if (!(video.game.id in byGame)){
                byGame[video.game.id] = {
                    videos: [],
                    byChar: {},
                    byPlayer: {}
                };
            }
            var gameObj = byGame[video.game.id]
            gameObj.videos.push(video);
            var byChar = gameObj.byChar;
            video.characters.forEach(function (char){
                if (!(char.id in byChar)){
                    byChar[char.id] = [];
                }
                byChar[char.id].push(video);
            });
            var byPlayer = gameObj.byPlayer;
            video.players().forEach(function (player){
                if (!(player.id in byPlayer)){
                    byPlayer[player.id] = [];
                }
                byPlayer[player.id].push(video);
            });
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
