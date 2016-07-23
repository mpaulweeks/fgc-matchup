
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