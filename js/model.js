

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
                return GameItem("unknown", "(unknown)");
            }
        }
        return lookup[gameId];
    }

    return self;
})();

var PlayerManager = (function(){
    var self = {};
    var lookup = {};

    function PlayerItem(name){
        var item = {};
        item.name = TYPO.fixPlayerName(name);
        item.id = TOOL.fixValue(item.name);
        return item;
    }

    self.get = function(playerName){
        var playerItem = PlayerItem(playerName);
        if (!(playerItem.id in lookup)){
            lookup[playerItem.id] = playerItem;
        }
        return lookup[playerItem.id];
    }

    return self;
})();

var CharacterManager = (function(){
    var self = {};
    var lookup = {};

    function CharacterItem(name){
        var item = {};
        item.name = TYPO.fixCharacterName(name);
        item.id = TOOL.fixValue(item.name);
        return item;
    }

    self.get = function(charName){
        var charItem = CharacterItem(charName);
        if (!(charItem.id in lookup)){
            lookup[charItem.id] = charItem;
        }
        return lookup[charItem.id];
    }

    return self;
})();

function VideoItem(
    timestamp,
    id,
    title,
    game,
    characterTuples,
    playerNames)
{
    var self = {
        game: game,
    }

    var date = timestamp.split('T')[0];
    var allChars = new Set();
    var characterSets = [new Set(characterTuples[0]), new Set(characterTuples[1])];
    characterSets.forEach(function (charSet){
        charSet.forEach(function (char){
            allChars.add(char);
        });
    });
    self.characters = [];
    allChars.forEach(function (charName){
        self.characters.push(CharacterManager.get(charName));
    });
    self.players = [];
    playerNames.forEach(function (playerName){
        self.players.push(PlayerManager.get(playerName));
    });

    function characterStr(index){
        return characterTuples[index].join(', ');
    }

    self.isMirror = function(char){
        // check if both player's rosters contain char
        return characterSets[0].has(char) && characterSets[1].has(char);
    }

    self.iFrame = function(){
        var html = (
            '<iframe id="ytplayer" type="text/html" width="640" height="390" src="https://www.youtube.com/embed/'
            + self.id
            + '?autoplay=1"  frameborder="0"></iframe>'
        );
        return html;
    }

    var youtubeLink = '<a class="external" target="_blank" href="https://youtu.be/{1}">{2}</a>';
    var playerClass = 'link-player';
    var characterClass = 'link-character';

    self.toData = function(){
        return [
            TOOL.format(youtubeLink, id, date),
            TOOL.internalLink(playerClass, self.players[0].id, self.players[0].name),
            TOOL.internalLink(characterClass, characterStr(0)), // todo
            TOOL.internalLink(playerClass, self.players[1].id, self.players[1].name),
            TOOL.internalLink(characterClass, characterStr(1)),
        ];
    }

    return self;
}
