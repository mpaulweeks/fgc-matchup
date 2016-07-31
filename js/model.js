
var GameManager = (function(){
    var self = {};
    var lookup = {};

    function GameItem(id, name){
        var item = {
            id: id,
            name: name,
        };
        return item;
    }

    self.get = function(gameId){
        if (!(gameId in lookup)){
            if (gameId in CONSTANTS.GAME_NAMES){
                lookup[gameId] = GameItem(gameId, CONSTANTS.GAME_NAMES[gameId]);
            } else {
                return false;
            }
        }
        return lookup[gameId];
    }

    return self;
})();

var CharacterManager = (function(){
    var self = {};
    var lookup = {};

    function CharacterItem(name){
        var item = {};
        item.name = name;
        item.id = TOOL.fixValue(item.name);
        return item;
    }

    self.get = function(charId){
        return lookup[charId];
    }

    self.new = function(charName){
        var charItem = CharacterItem(charName);
        if (!(charItem.id in lookup)){
            lookup[charItem.id] = charItem;
        }
        return self.get(charItem.id);
    }

    return self;
})();

var PlayerManager = (function(){
    var self = {};
    var lookup = {};

    function PlayerItem(name){
        var item = {};
        item.name = name;
        item.id = TOOL.fixValue(item.name);
        return item;
    }

    self.get = function(playerId){
        return lookup[playerId];
    }

    self.new = function(playerName){
        var playerItem = PlayerItem(playerName);
        if (!(playerItem.id in lookup)){
            lookup[playerItem.id] = playerItem;
        }
        return self.get(playerItem.id);
    }

    return self;
})();
