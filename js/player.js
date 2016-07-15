
var PlayerManager = (function(){
    var self = {};
    var lookup = {};
    var registry = null;

    self.getDisplayName = function(playerName){
        return registry[playerKey(playerName)].displayName;
    }

    function PlayerItem(name){
        var item = {};
        item.name = self.getDisplayName(name);
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

    function playerKey(playerName){
        return playerName.toLowerCase().trim().replace(/\s+/g, '');
    }

    function register(playerName){
        var key = playerKey(playerName);
        if (!(key in registry)){
            registry[key] = {
                displayName: null,
                count: 0,
                matches: {},
            }
        }
        registry[key].count += 1;
        var matches = registry[key].matches;
        if (!(playerName in matches)){
            matches[playerName] = 0;
        }
        matches[playerName] += 1;
    }

    self.organize = function(playerNames){
        registry = {};
        playerNames.forEach(function (playerName){
            register(playerName);
        });
        for (var key in registry){
            if (registry.hasOwnProperty(key)){
                var reg = registry[key];
                var maxName = null;
                var maxCount = 0;
                for (var playerName in reg.matches){
                    // determine best names
                    if (reg.matches.hasOwnProperty(playerName)){
                        if (reg.matches[playerName] > maxCount){
                            maxName = playerName;
                            maxCount = reg.matches[playerName];
                        }
                    }
                }
                reg.displayName = maxName;
            }
        }
    }

    return self;
})();