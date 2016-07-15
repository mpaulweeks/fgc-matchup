
var PlayerManager = (function(){
    var self = {};
    var lookup = {};
    var regByGame = {};

    self.getDisplayName = function(gameId, playerName){
        var registry = regByGame[gameId];
        var reg = registry[playerKey(playerName)];
        while (reg.levensteinKey && reg.count < registry[reg.levensteinKey].count){
            reg = registry[reg.levensteinKey];
        }
        return reg.displayName;
    }

    function PlayerItem(gameId, name){
        var item = {};
        item.name = self.getDisplayName(gameId, name);
        item.id = TOOL.fixValue(item.name);
        return item;
    }

    self.get = function(playerId){
        return lookup[playerId];
    }

    self.new = function(gameId, playerName){
        var playerItem = PlayerItem(gameId, playerName);
        if (!(playerItem.id in lookup)){
            lookup[playerItem.id] = playerItem;
        }
        return self.get(playerItem.id);
    }

    function playerKey(playerName){
        return playerName.toLowerCase().trim().replace(/\s+/g, '');
    }

    function register(registry, playerName){
        var key = playerKey(playerName);
        if (!(key in registry)){
            registry[key] = {
                displayName: null,
                levensteinKey: null,
                levensteinDistance: null,
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

    function calculateLevenstein(registry){
        var regKeys = Object.keys(registry);

        var levenReq = 1;
        regKeys.forEach(function (key1, index1){
            var reg1 = registry[key1];
            var levenKey = reg1.levensteinKey;
            var levenMin = reg1.levensteinDistance;
            regKeys.forEach(function (key2, index2){
                if (index1 < index2){
                    var distance = key1.levenstein(key2);
                    if (distance <= levenReq && (levenMin == null || distance < levenMin)){
                        levenKey = key2;
                        levenMin = distance;
                    }
                }
            });
            if (levenKey != reg1.levensteinKey){
                reg1.levensteinKey = levenKey;
                reg1.levensteinDistance = levenMin;
                registry[levenKey].levensteinKey = key1;
                registry[levenKey].levensteinDistance = levenMin;
                console.log(levenKey, key1);
            }
        });
    }

    self.organize = function(gameId, playerNames){
        var registry = {};
        playerNames.forEach(function (playerName){
            register(registry, playerName);
        });

        var regKeys = Object.keys(registry);

        regKeys.forEach(function (key){
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
        });

        // disabled for now, takes too long :(
        // calculateLevenstein(registry);

        regByGame[gameId] = registry;
    }

    return self;
})();