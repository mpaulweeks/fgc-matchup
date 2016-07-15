
var PlayerManager = (function(){
    var self = {};
    var lookup = {};
    var registry = null;

    self.getDisplayName = function(playerName){
        var reg = registry[playerKey(playerName)];
        while (reg.levensteinMatch){
            reg = registry[reg.levensteinMatch];
        }
        return reg.displayName;
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
                levensteinMatch: null,
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

    function calculateLevenstein(){
        var regKeys = Object.keys(registry);

        var levenReq = 1;
        regKeys.forEach(function (key1){
            var reg1 = registry[key1];
            var levenKey = null;
            var levenMin = 100;
            regKeys.forEach(function (key2){
                if (key1 != key2){
                    var distance = key1.levenstein(key2);
                    if (distance <= levenReq && distance < levenMin){
                        levenKey = key2;
                        levenMin = distance;
                    }
                }
            });
            if (levenKey){
                if (registry[levenKey].count > reg1.count){
                    reg1.levensteinKey = levenKey;
                    console.log(levenKey, key1);
                }
            }
        });
    }

    self.organize = function(playerNames){
        registry = {};
        playerNames.forEach(function (playerName){
            register(playerName);
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
        // calculateLevenstein();
    }

    return self;
})();