
var PlayerManager = (function(){
    var self = {};
    var lookup = {};

    self.getDisplayName = function(gameId, playerName){
        // defunct and unused, keeping around until ported to scala
        var registry = regByGame[gameId];
        var reg = registry[playerKey(playerName)];
        while (reg.levensteinKey && reg.count < registry[reg.levensteinKey].count){
            reg = registry[reg.levensteinKey];
        }
        return reg.displayName;
    }

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

    function calculateLevenstein(registry){
        // defunct and unused, keeping around until ported to scala
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

    return self;
})();